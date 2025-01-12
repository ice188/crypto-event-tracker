import axios, { AxiosError } from "axios";

export const createAlert = async (
  user_id: number,
  alert_type: string,
  threshold_type: string,
  target_value: number,
  coin_name: string,
  coin_symbol: string,
  coin_image: string
) => {
  try {
    
    await axios.post(
      `${import.meta.env.VITE_ALERT_API_PORT}/api/alert/create-alert`,
      {
        user_id,
        alert_type,
        threshold_type,
        target_value,
        coin_name,
        coin_symbol,
        coin_image,
      }
    );

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      }
    }
  }
};
