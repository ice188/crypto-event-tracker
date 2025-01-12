import axios from "axios";

export const deleteAlert = async (alert_id: number) => {
  await axios.post(
    `${import.meta.env.VITE_ALERT_API_PORT}/api/alert/delete-alert`,
    {
      alert_id,
    }
  );
};
