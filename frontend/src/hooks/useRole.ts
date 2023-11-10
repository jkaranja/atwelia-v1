import { useEffect, useState } from "react";
import { Role } from "../types/user";

//not used//too local
const useRole = () => {
  const [role, setRole] = useState(
    localStorage.getItem("role") === Role.Agent ? Role.Agent : Role.Renter
  );

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  return [role, setRole] as const; //infer a tuple instead of (typeof persist | typeof setPersist)[]
};
export default useRole;
