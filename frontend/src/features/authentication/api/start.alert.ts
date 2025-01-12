import axios from "axios";

export const startAlert = async (token: string) => {
  const { data: payload } = await axios.post(
    `${import.meta.env.VITE_NOTIF_API_PORT}/api/notification/start-alert`,
    { token },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(`Notification service started! ${payload}`);
};
