import jwtDecode, { JwtPayload } from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { AccountStatus, Role } from "../types/user";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  type customJwtPayload = JwtPayload & {
    user: { roles: Role[]; _id: string; accountStatus: AccountStatus };
  };

  if (token) {
    const decoded = jwtDecode<customJwtPayload>(token);

    if (!decoded) return [];
    const { roles, _id, accountStatus } = decoded.user;

    return [roles, _id, accountStatus] as const; //important// infers tuple [ typeof roles] instead of (string[] | string)[]
  }
  //if token is null, useAuth will return undefined & you can't destructure undefined like const [roles] = useAuth() //err: must have a '[Symbol.iterator]
  //so return empty array
  return [];
};
export default useAuth;
