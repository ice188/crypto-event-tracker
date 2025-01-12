import {
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const fetchDataFromS3 = async (
  coinId: string,
  fromDate: Date,
  toDate: Date
) => {
  try {
    const listRes = await s3Client.send(
      new ListObjectsCommand({
        Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
        Prefix: `crypto-data/${coinId}/`,
      })
    );

    const files = listRes.Contents;
    const filteredKeys = files
      ?.filter((file) => {
        const fileName = file.Key?.split("/").pop();
        if (fileName) {
          const timestampString = fileName.split(".").shift() + "Z";
          return (
            timestampString &&
            new Date(timestampString) >= fromDate &&
            new Date(timestampString) <= toDate
          );
        }
        return false;
      })
      .map((file) => file.Key);

    if (!filteredKeys || filteredKeys.length === 0) {
      console.log("No files found for the given date range.");
      return { priceData: [], volumeData: [] };
    }

    const dataPromises = filteredKeys.map(async (key) => {
      const res = await s3Client.send(
        new GetObjectCommand({
          Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
          Key: key,
        })
      );
      const data = await res.Body?.transformToString();
      return data ? JSON.parse(data) : null;
    });

    const allData = await Promise.all(dataPromises);
    const filteredData = allData.filter((data) => data !== null);

    const priceData: { time: string; price: number }[] = [];
    const volumeData: { time: string; volume: number }[] = [];

    filteredData.forEach((data, index) => {
      const fileName = filteredKeys[index]?.split("/").pop();
      const timestampString = fileName?.split(".").shift() + "Z";
      if (!timestampString) {
        return { priceData: [], volumeData: [] };
      }
      if (
        data?.currentPrice !== undefined &&
        data?.totalVolume !== undefined &&
        timestampString
      ) {
        priceData.push({ time: timestampString, price: data.currentPrice });
        volumeData.push({ time: timestampString, volume: data.totalVolume });
      }
    });

    console.log({ priceData, volumeData });
    return { priceData, volumeData };
  } catch (error) {
    console.error("Error fetching data from S3", error);
    return { priceData: [], volumeData: [] };
  }
};
