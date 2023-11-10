
import axios from "axios";
import { useRefreshMutation } from "../features/auth/authApiSlice";


const useRefreshToken = () => {
  //req new access token and store it in state
  const [refreshToken] = useRefreshMutation();

  const refresh = async () => {
    try {
      const { accessToken } = await refreshToken().unwrap();

      return accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          error.response?.data?.message || error.message || error.toString()
        );
        return;
      }
      console.error(error);
    }
  };
  return refresh;
};

export default useRefreshToken;
