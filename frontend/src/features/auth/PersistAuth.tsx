import { useEffect } from "react";
import { useSelector } from "react-redux";
import usePersist from "../../hooks/usePersist";
import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";

//for homepage. Auth is not required to load page but we need token to eg add to favorites
const PersistAuth = () => {

   const [persist] = usePersist();

  //or use skipToken instead of mutation with GET mtd
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    //fetch using refresh token in cookie and store access token in store
    const getToken = async () => {
      //you can unwrap a trigger function to get the raw response here as well instead of data
      await refresh();
    };
    if (persist && !token) getToken();
  }, []);

  return <Outlet />;
};

export default PersistAuth;
