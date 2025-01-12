import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { requestNotificationPermission } from "../config/firebase";
import { startAlert } from "../api/start.alert";

export function GitHubCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");

    const login = async () => {
      try {
        const {
          data: { id_token },
        } = await axios.post(
          `${
            import.meta.env.VITE_USER_API_PORT
          }/api/auth/github/create-session`,
          { code }
        );
        localStorage.setItem("github-token", id_token);

        const { data: payload } = await axios.post(
          `${import.meta.env.VITE_USER_API_PORT}/api/auth/github/get-payload`,
          { id_token }
        );

        const { email, name, picture } = payload;

        const { data: user_id } = await axios.post(
          `${import.meta.env.VITE_USER_API_PORT}/api/auth/`,
          {
            email,
            user_name: name,
            picture,
            oauth_provider: "github",
          }
        );

        return user_id;
      } catch (error) {
        console.error("Login error:", error);
        alert("Failed to log in. Please try again.");
      }
    };

    const handleNotificationAndAlert = async () => {
      try {
        let token;
        while (!token) {
          await requestNotificationPermission();
          token = localStorage.getItem("fcm_token");
        }
        await startAlert(token);
      } catch (error) {
        console.error("Notification or Alert setup error:", error);
        alert("Failed to set up notifications. Please try again.");
      }
    };

    if (code) {
      login().then(() => {
        handleNotificationAndAlert();
        navigate("/alerts");
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Processing GitHub login...
        </h2>
        <p className="text-gray-500">
          Please wait while we complete the authentication process.
        </p>
      </div>
    </div>
  );
}
