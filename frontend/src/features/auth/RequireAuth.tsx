import { Backdrop, CircularProgress } from "@mui/material";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Outlet,
  useLocation,
 
} from "react-router-dom";
import usePersist from "../../hooks/usePersist";

import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";

const RequireAuth = () => {
  const [persist] = usePersist();

  const [trueSuccess, setTrueSuccess] = useState(false);

  //or use skipToken instead of mutation with GET mtd
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  let content;

  const location = useLocation();

  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    //fetch using refresh token in cookie and store access token in store
    //if error eg refresh has expired, go to login
    const getToken = async () => {
      try {
        //you can unwrap a trigger function to get the raw response here as well instead of data
        await refresh();
        //isSuccess will be true b4 our token is dispatched onQuery started. Trying to get this token immediately in our protected routes will return token as null as our dispatch might not have completed adding token to the store.
        //Sol:, we use setTrueSuccess to prevent rendering protected routes until the refresh query promise resolves and token is now in the store.
        setTrueSuccess(true);
      } catch (error) {
        //errs will be in the error object as well
        console.error(error); //raw err
      }
    };
    if (persist && !token) getToken();
  }, []);

  if (isLoading) {
    content = (
      <Backdrop
        sx={{
          color: "#fff",
          bgcolor: "primary.main",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (isSuccess && trueSuccess) {
    //after re-render due to state change & dispatch has run// token=true below will catch this as well
    //allow protected access
    content = <Outlet />;
  } else if (isError) {
    //login/home page
    content = <Navigate to="/" state={{ from: location }} replace />;
  } else if (token && isUninitialized) {
    //token: true// handles !persist && token / persist && token
    //allow protected access
    content = <Outlet />;
  } else if (!persist && !token) {
    //login/home page
    content = <Navigate to="/" state={{ from: location }} replace />;
  }

  return content as JSX.Element;
};

export default RequireAuth;
