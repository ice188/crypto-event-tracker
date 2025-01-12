import axios from "axios";

export const getCryptos = async () => {
  const { data: cryptosResponse } = await axios.get(
    `${import.meta.env.VITE_ALERT_API_PORT}/api/crypto/get-cryptos`
  );

  return cryptosResponse;
};
