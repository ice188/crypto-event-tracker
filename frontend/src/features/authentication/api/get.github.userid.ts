import axios from "axios";

export const getGithubUserId = async (id_token: string) => {
  const { data: payload } = await axios.post(
    `${import.meta.env.VITE_USER_API_PORT}/api/auth/github/get-payload`,
    {
      id_token,
    }
  );
  const { email, name, picture } = payload;

  const { data: userResponse } = await axios.post(
    `${import.meta.env.VITE_USER_API_PORT}/api/auth/`,
    {
      email,
      user_name: name,
      picture,
      oauth_provider: "github",
    }
  );
  const { user_id } = userResponse;
  return user_id;
};
