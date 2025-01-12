import { useState, useEffect } from "react";
import { database, ref, onValue } from "../config/firebase";
import { DataSnapshot } from "firebase/database";
import { CryptoData } from "../types/crypto";
import { Link } from "react-router-dom"; 

export default function CryptoList() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const cryptoRef = ref(database, "crypto");

    const listener = (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const cryptoArray = Object.entries(data)
          .map(([cryptoId, cryptoData]) => {
            if (cryptoData && typeof cryptoData === "object") {
              const {
                symbol,
                name,
                currentPrice,
                priceChangePercentage,
                high,
                low,
                image,
              } = cryptoData as CryptoData;

              return {
                id: cryptoId,
                name,
                symbol,
                currentPrice,
                priceChangePercentage,
                high,
                low,
                image,
              };
            }
            return null;
          })
          .filter((crypto) => crypto !== null);

        setCryptos(cryptoArray as CryptoData[]);
      }
    };

    const unsubscribe = onValue(cryptoRef, listener);

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-blue-900 min-h-screen pt-[62.62px]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center pt-4 pb-8">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCryptos.map((crypto) => (
            <Link to={`/crypto/${crypto.id}`} key={crypto.id}>
               {/* <Link to={`/crypto/detail`} key={crypto.id}> */}
              <div
                className="p-6 bg-white shadow-md rounded-lg flex items-center justify-between hover:bg-gray-200 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {crypto.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {crypto.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    ${crypto.currentPrice.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      crypto.priceChangePercentage >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {crypto.priceChangePercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
