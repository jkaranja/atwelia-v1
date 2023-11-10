import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import Container from "@mui/material/Container";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./components/Layout";
import About from "./pages/About";
import Contact from "./pages/Contact";

import NotFound from "./pages/NotFound";

import Login from "./features/auth/Login";

import Signup from "./features/auth/Signup";

import { themeSettings } from "./theme";

import DashLayout from "./features/layouts/DashLayout";
import RentalListings from "./features/listings/rentals/RentalListings";

import PersistAuth from "./features/auth/PersistAuth";
import RequireAuth from "./features/auth/RequireAuth";

import Settings from "./features/settings/Settings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import Forgot from "./features/auth/Forgot";
import Reset from "./features/auth/Reset";
import Chat from "./features/chat/Chat";
import FavoriteList from "./features/listings/favorites/FavoritesList";
import ListingsList from "./features/listings/mylistings/ListingsList";
import Payments from "./features/payments/Payments";
import UserProfile from "./features/profile/UserProfile";
import ToursList from "./features/tours/ToursList";
import Deletion from "./pages/Deletion";

function App() {
  //you can allow users to switch between dark and light manually or apply mode set in users os using
  // @media('prefers-color-scheme: dark') query(in css). With Mui you can use useMediaQuery hook instead
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = themeSettings(prefersDarkMode);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {/* //fluid sets width to 100% in BStrap//here maxWidth is used //default is maxWidth="md" not full width//
      //set maxWidth={false} to have 100% width// can also have sm - xl//not 100%// 
      //disableGutters removes px padding. 
      //put all your components inside Router/BrowserRouter to use router dom hooks in them//Routes only has <route /> children */}
      <Router>
        <Container maxWidth={false} disableGutters>
          <Routes>
            {/* public routes */}
            <Route element={<Layout />}>
              <Route element={<PersistAuth />}>
                <Route index element={<RentalListings />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route path="favorites">
                  <Route index element={<FavoriteList />} />
                </Route>
              </Route>
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="deletion" element={<Deletion />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot" element={<Forgot />} />
              <Route path="reset/:token" element={<Reset />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              <Route element={<DashLayout />}>
                <Route path="listings">
                  <Route index element={<ListingsList />} />
                </Route>

                <Route path="tours">
                  <Route index element={<ToursList />} />
                </Route>

                <Route path="payments">
                  <Route index element={<Payments />} />
                </Route>

                <Route path="profile">
                  <Route index element={<UserProfile />} />
                </Route>

                <Route path="settings">
                  <Route index element={<Settings />} />
                </Route>

                <Route path="messages">
                  <Route index element={<Chat />} />
                </Route>
              </Route>
            </Route>
            {/* End Protected Routes */}
          </Routes>
        </Container>
      </Router>
      <ToastContainer
        theme="dark"
        autoClose={3000} //in milliseconds || false //if false, no progress bar//
        hideProgressBar={true} //default: false
        //pauseOnFocusLoss={false} //default: true
        pauseOnHover
        closeOnClick //disabled autoClose
        draggable
      />
    </ThemeProvider>
  );
}

export default App;
