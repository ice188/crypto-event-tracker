import { useEffect, useState } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { getGoogleUserId } from "../../authentication/api/get.google.userid";
import { getGithubUserId } from "../../authentication/api/get.github.userid";
import { createAlert } from "../api/create.alert";
import { getAlerts } from "../api/get.alerts";
import { deleteAlert } from "../api/delete.alert";
import { getCryptos } from "../api/get.coins";

export function Alert() {
  const [coins, setCoins] = useState<
    { image: string; name: string; symbol: string }[]
  >([]);
  const [alertType, setAlertType] = useState("price");
  const [thresholdType, setThresholdType] = useState("above");
  const [targetValue, setTargetValue] = useState(0);
  const [percentageValue, setPercentageValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [alerts, setAlerts] = useState<
    {
      id: number;
      user_id: number;
      alert_type: string;
      threshold_type: string;
      target_value: number;
      coin_name: string;
      coin_symbol: string;
      coin_image: string;
      last_triggered: Date | null;
    }[]
  >([]);
  const [selectedCoin, setSelectedCoin] = useState<{
    image: string;
    name: string;
    symbol: string;
  } | null>(null);
  const navigate = useNavigate();

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const loadId = async () => {
      const googleToken = localStorage.getItem("google-token");
      const githubToken = localStorage.getItem("github-token");
      if (!googleToken && !githubToken) {
        navigate("/login");
      } else if (googleToken) {
        try {
          setUserId(await getGoogleUserId(googleToken));
        } catch (error) {
          console.log(error);
          localStorage.removeItem("google-token");
          navigate("/login");
        }
      } else if (githubToken) {
        try {
          setUserId(await getGithubUserId(githubToken));
        } catch (error) {
          console.log(error);
          localStorage.removeItem("github-token");
          navigate("/login");
        }
      }
    };
    loadId();
    if (userId) {
      const loadAlerts = async () => {
        setAlerts(await getAlerts(userId));
      };
      loadAlerts();
    }
    const loadCryptos = async () => {
      const cryptos = await getCryptos();
      setCoins(cryptos);
      setSelectedCoin(cryptos[0]);
    };
    loadCryptos();
  }, [navigate, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userId && selectedCoin) {
      const addAlert = async () => {
        await createAlert(
          userId,
          alertType,
          thresholdType,
          targetValue,
          selectedCoin.name,
          selectedCoin.symbol,
          selectedCoin.image
        );
      };
      addAlert();

      const newAlert = {
        id: userId,
        user_id: userId,
        alert_type: alertType,
        threshold_type: thresholdType,
        target_value: targetValue,
        coin_name: selectedCoin.name,
        coin_symbol: selectedCoin.symbol,
        coin_image: selectedCoin.image,
        last_triggered: null,
      };
      setAlerts([...alerts, newAlert]);
      resetForm();
    } else {
      navigate("/login");
    }
  };

  const resetForm = () => {
    setTargetValue(0);
    setPercentageValue(0);
  };

  const handleDeleteAlert = (id: number) => {
    if (window.confirm("Are you sure you want to delete this alert?")) {
      deleteAlert(id);
      setAlerts(alerts.filter((alert) => alert.id !== id));
    }
  };

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.coin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.coin_symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-blue-900 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg">
            <h2 className="text-center mt-4 mb-8 text-2xl font-bold tracking-tight text-white">
              Your Active Alerts
            </h2>

            <input
              type="text"
              placeholder="Search by coin name or symbol"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-black w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <ul className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <li className="text-center text-gray-500">No alerts found</li>
              ) : (
                filteredAlerts.map((alert) => (
                  <li
                    key={`${alert.user_id}${alert.coin_name}${alert.alert_type}${alert.threshold_type}${alert.target_value}`}
                    className="hover:bg-gray-200 p-4 rounded-lg flex items-center transition duration-300 bg-white"
                  >
                    <img
                      src={alert.coin_image}
                      alt={alert.coin_name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">
                        {alert.coin_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {alert.coin_symbol}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          alert.threshold_type === "above"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {alert.alert_type === "price"
                          ? `price ${
                              alert.threshold_type === "above" ? ">" : "<"
                            } $${alert.target_value}`
                          : `24h price change ${
                              alert.threshold_type === "above" ? ">" : "<"
                            } ${alert.target_value}%`}
                      </p>

                      {/* Last Triggered */}
                      <p className="text-sm text-gray-400 mt-2">
                        Last triggered:{" "}
                        {!alert.last_triggered
                          ? null
                          : new Date(alert.last_triggered).toLocaleString()}
                      </p>
                    </div>
                    <XMarkIcon
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                    />
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg max-h-[566px]">
            <h2 className="text-center mt-4 mb-4 text-2xl font-bold tracking-tight text-gray-700">
              Create New Alert
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6 text-md">
                {/* Coin Selection */}
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-700">
                    <strong>Select Coin</strong>
                  </p>
                  <Menu as="div" className="relative">
                    <MenuButton className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2 hover:bg-gray-200">
                        <img
                          src={selectedCoin?.image}
                          alt={selectedCoin?.name}
                          className="w-6 h-6"
                        />
                        <span>{selectedCoin?.name}</span>
                      </div>
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    </MenuButton>
                    <MenuItems className="absolute z-10 mt-1 flex flex-col rounded-lg w-full bg-white shadow-lg border border-gray-300 max-h-60 overflow-y-auto">
                      {coins.map((coin, index) => (
                        <MenuItem
                          key={coin.name}
                          as="button"
                          onClick={() => setSelectedCoin(coin)}
                        >
                          <div
                            className={`px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 ${
                              selectedCoin === coin ? "bg-gray-100" : "bg-white"
                            } ${index === 0 && "rounded-t-lg"} ${
                              index === coins.length - 1 && "rounded-b-lg"
                            } `}
                          >
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-6 h-6"
                            />
                            <span>{coin.name}</span>
                          </div>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
              <div className="space-y-6 text-md">
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-700">
                    <strong>Alert Type</strong>
                  </p>
                  <Menu as="div" className="relative">
                    <MenuButton className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between">
                      <span>
                        {alertType === "price" ? "Price" : "24h Price Change %"}
                      </span>
                      <ChevronDownIcon className="w-5 h-5 text-white" />
                    </MenuButton>
                    <MenuItems className="absolute z-10 mt-1 flex flex-col rounded-lg w-full bg-white shadow-lg border border-gray-300">
                      <MenuItem
                        className={`px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 rounded-t-lg ${
                          alertType === "price" ? "bg-gray-100" : "bg-white"
                        }`}
                        as="button"
                        onClick={() => setAlertType("price")}
                      >
                        <div>Price</div>
                      </MenuItem>
                      <MenuItem
                        as="button"
                        className={`px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 rounded-b-lg ${
                          alertType === "percentage"
                            ? "bg-gray-100"
                            : "bg-white"
                        }`}
                        onClick={() => setAlertType("percentage")}
                      >
                        <div>24h Price Change %</div>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-700">
                    <strong>Threshold Type</strong>
                  </p>
                  <Menu as="div" className="relative">
                    <MenuButton className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between">
                      <span>
                        {thresholdType === "above" ? "Above" : "Below"}
                      </span>
                      <ChevronDownIcon className="w-5 h-5 text-white" />
                    </MenuButton>
                    <MenuItems className="absolute z-10 mt-1 flex flex-col rounded-lg w-full bg-white shadow-lg border border-gray-300">
                      <MenuItem
                        as="button"
                        className={`px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 rounded-t-lg ${
                          thresholdType === "above" ? "bg-gray-100" : "bg-white"
                        }`}
                        onClick={() => setThresholdType("above")}
                      >
                        <div className={``}>Above</div>
                      </MenuItem>
                      <MenuItem
                        as="button"
                        className={`px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 rounded-b-lg ${
                          thresholdType === "below" ? "bg-gray-100" : "bg-white"
                        }`}
                        onClick={() => setThresholdType("below")}
                      >
                        <div>Below</div>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
                <div className="flex flex-col space-y-2">
                  {alertType === "price" && (
                    <>
                      <p className="text-gray-700">
                        <strong>Target Price</strong>
                      </p>
                      <div className="mt-1 flex flex-col rounded-lg w-full bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <input
                          type="number"
                          value={targetValue}
                          onChange={(e) =>
                            setTargetValue(parseFloat(e.target.value))
                          }
                          className="px-4 py-2 flex items-center rounded-lg space-x-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter target price"
                        />
                      </div>
                    </>
                  )}
                  {alertType === "percentage" && (
                    <>
                      <p className="text-gray-700">
                        <strong>Target Price % </strong>
                      </p>
                      <div className="mt-1 flex flex-col rounded-lg w-full bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <input
                          type="number"
                          value={percentageValue}
                          onChange={(e) =>
                            setPercentageValue(parseFloat(e.target.value))
                          }
                          className="px-4 py-2 flex items-center rounded-lg space-x-2 hover:bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter target percentage"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg mt-2"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
