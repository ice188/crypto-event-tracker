import axios from "axios";

export const getAlerts = async (
  user_id: number
) => {
  const { data: alertResponse } = await axios.post(
    `${import.meta.env.VITE_ALERT_API_PORT}/api/alert/get-alerts`,
    {
      user_id
    }
  );
  
  return alertResponse;
};
