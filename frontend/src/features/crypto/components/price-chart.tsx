/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { database, ref, onValue } from "../config/firebase";
import { DataSnapshot } from "firebase/database";
import { CryptoData } from "../types/crypto";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  TimeScale
);
import "chartjs-adapter-moment";
import { useParams } from "react-router-dom";
import { fetchDataFromS3 } from "../config/aws-s3";

const formatDate = (date: Date): string => date.toISOString().split("T")[0];

export default function PriceTrendChart() {
  const { coinId } = useParams();
  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [priceData, setPriceData] = useState<{ time: string; price: number }[]>(
    []
  );
  const [volumeData, setVolumeData] = useState<
    { time: string; volume: number }[]
  >([]);
  const [fromDate, setFromDate] = useState<string>(
    formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  );
  const [toDate, setToDate] = useState<string>(formatDate(new Date()));

  useEffect(() => {
    const fromDateUTC = new Date(fromDate + "T00:00:00Z");
    const toDateUTC = new Date(toDate + "T23:59:59Z");

    const fetchS3Data = async () => {
      try {
        if (coinId) {
          const res = await fetchDataFromS3(coinId, fromDateUTC, toDateUTC);
          if (res) {
            const { priceData, volumeData } = res;
            setPriceData(priceData);
            setVolumeData(volumeData);
          }
        }
        // setPriceData([
        //   { time: "2025-01-05T02:06:22.000Z", price: 356.37 },
        //   { time: "2025-01-06T02:06:22.000Z", price: 356.37 },
        // ]);
        // setVolumeData([
        //   { time: "2025-01-05T02:06:22.000Z", volume: 621718113 },
        //   { time: "2025-01-06T02:06:22.000Z", volume: 621718113 },
        // ]);
      } catch (error) {
        console.error("Error fetching data from S3:", error);
      }
    };

    fetchS3Data();
  }, [coinId, fromDate, toDate]);

  useEffect(() => {
    //firebase crypto stats
    const cryptoRef = ref(database, `crypto/${coinId}`);

    const listener = (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        setCrypto(data);
      }
    };

    const unsubscribe = onValue(cryptoRef, listener);

    return () => {
      unsubscribe();
    };
  }, [coinId]);

  const priceChartData = {
    labels: priceData.map((entry) => entry.time.split("T")[0]),
    datasets: [
      {
        label: "Price $",
        data: priceData.map((entry) => entry.price),
        borderColor: "#00bcd4",
        backgroundColor: "rgba(0, 188, 212, 0.2)",
        fill: false,
      },
    ],
  };

  const volumeChartData = {
    labels: volumeData.map((entry) => entry.time.split("T")[0]),
    datasets: [
      {
        label: "Volume",
        data: volumeData.map((entry) => entry.volume),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
    ],
  };

  const abbreviateNumber = (num: number) => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1) + "B";
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "K";
    } else if (num < 1 && num > 0) {
      return num.toPrecision(2);
    } else {
      return parseFloat(num.toFixed(2)).toString();
    }
    return num.toString();
  };

  return (
    <div className="bg-blue-900 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-1">
            <div className="flex items-center mb-6">
              <img
                src={crypto?.image}
                alt={crypto?.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <h4 className="text-xl font-semibold text-gray-700">
                {crypto?.name}
              </h4>
            </div>
            <div className="space-y-6 text-md">
              <div className="flex flex-col space-y-2">
                <p className="text-gray-700">
                  <strong>Price:</strong>
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  ${crypto?.currentPrice}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <p className="text-gray-700">
                  <strong>24h Change:</strong>
                </p>
                <p
                  className={`text-xl font-semibold ${
                    crypto && crypto.priceChangePercentage >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {crypto?.priceChangePercentage.toFixed(2)}%
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <p className="text-gray-700">
                  <strong>Volume:</strong>
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {crypto?.totalVolume}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <p className="text-gray-700">
                  <strong>Market Cap:</strong>
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  ${crypto?.marketCap}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <p className="text-gray-700">
                  <strong>Circulating Supply:</strong>
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {crypto?.circulatingSupply.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <p className="text-gray-700">
                  <strong>Max Supply:</strong>
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {crypto?.maxSupply}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex gap-4">
                <label className="text-white">
                  From:
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="md:ml-2 px-2 py-1 border rounded text-black"
                  />
                </label>
                <label className="text-white">
                  To:
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="md:ml-2 px-2 py-1 border rounded text-black"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-center text-xl font-semibold text-gray-700 mb-6">
                Price Trend - USD
              </h3>
              <Line
                data={priceChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      type: "time",
                      time: {
                        unit: "day",
                        tooltipFormat: "MMM DD YYYY HH:mm",
                      },
                      ticks: {
                        source: "data",
                      },
                    },
                    y: {
                      ticks: {
                        callback: (value) => abbreviateNumber(value as number),
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
              <h3 className="text-center text-xl font-semibold text-gray-700 mb-6">
                Volume Trend
              </h3>
              <Bar
                data={volumeChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      type: "time",
                      time: {
                        unit: "day",
                        tooltipFormat: "MMM DD YYYY HH:mm",
                      },
                      ticks: {
                        source: "data",
                      },
                    },
                    y: {
                      ticks: {
                        callback: (value) => abbreviateNumber(value as number),
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
