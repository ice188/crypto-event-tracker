const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');  

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function storeDataInS3(data) {
  const timestamp = new Date().toISOString();
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `crypto-data/${data.id}/${timestamp}.json`,
    Body: JSON.stringify(data),
    ContentType: "application/json",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log(`Data stored in S3: ${params.Key}`);
  } catch (error) {
    console.error("Error storing data in S3:", error);
  }
}

module.exports = { storeDataInS3 };