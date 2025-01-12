import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { requestNotificationPermission } from "../config/firebase";
import { startAlert } from "../api/start.alert";

export default function Login() {
  const BACKEND_PORT = import.meta.env.VITE_USER_API_PORT;
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const {
        data: { id_token },
      } = await axios.post(`${BACKEND_PORT}/api/auth/google/create-session`, {
        code,
      });

      localStorage.setItem("google-token", id_token);
      const { data: payload } = await axios.post(
        `${import.meta.env.VITE_USER_API_PORT}/api/auth/google/get-payload`,
        {
          id_token,
        }
      );
      const { email, name, picture } = payload;

      await axios.post(`${import.meta.env.VITE_USER_API_PORT}/api/auth/`, {
        email,
        user_name: name,
        picture,
        oauth_provider: "google",
      });
      await requestNotificationPermission();
      const token = localStorage.getItem("fcm_token");
      if (token){
        await startAlert(token);
      }
      
      navigate("/alerts");
    },
    flow: "auth-code",
  });

  const githubLogin = async () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${
      import.meta.env.VITE_GITHUB_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_GITHUB_REDIRECT_URI
    }&scope=user:email`;
  };

  return (
    <div className="w-full mt-8 bg-blue-900 ">
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-7xl flex mx-auto min-h-full flex-1 flex-col justify-center px-6 py-6">
          <div className="pt-12 pb-8 px-4 rounded-lg bg-white md:mx-24">
            <h2 className="text-center mt-4 mb-8 text-2xl font-bold tracking-tight text-gray-700">
              Unlock Real-Time Alerts For Free
            </h2>

            <div className="mt-8 flex flex-col gap-4 items-center">
              <button
                className="inline-flex h-10 w-full max-w-[400px] items-center justify-center gap-2 rounded-full border border-gray-300 bg-white p-2 text-sm font-medium text-gray-700 outline-none hover:bg-gray-200"
                onClick={() => googleLogin()}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-[18px] w-[18px]"
                />
                Continue with Google
              </button>

              <button
                className="inline-flex h-10 w-full max-w-[400px] items-center justify-center gap-2 rounded-full border border-gray-300 bg-white p-2 text-sm font-medium text-gray-700 outline-none hover:bg-gray-200"
                onClick={() => githubLogin()}
              >
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="GitHub"
                  className="h-[18px] w-[18px]"
                />
                Continue with GitHub
              </button>
            </div>

            <div className="mt-10 text-center text-sm text-gray-500">
              By proceeding, you agree to our{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
