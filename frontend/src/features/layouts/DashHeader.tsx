import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import {
  AppBar,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
  useScrollTrigger,
  Badge,
  Drawer,
} from "@mui/material";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { AccountStatus } from "../../types/user";
import { useSendLogoutMutation } from "../auth/authApiSlice";
import Onboard from "../onboarding/Onboard";
import { useGetNotificationsQuery } from "../notifications/notificationsApiSlice";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsList from "./NotificationsList";
import { setNotifications } from "../notifications/notificationSlice";
import MenuIcon from "@mui/icons-material/Menu";

/**------------------------------------
 * PAGES
 ----------------------------------*/
const PAGES = [
  { label: "My listings", url: "/listings" },
  // { label: "Tours", url: "/tours" },
  { label: "Messages", url: "/messages" },
];

const DashHeader = () => {
  const [roles, _id, accountStatus] = useAuth();

  const [sendLogout, { data, error, isLoading, isError, isSuccess }] =
    useSendLogoutMutation();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  //for adding border bottom on scroll
  const matches = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  /**------------------------------
   * NOTIFICATIONS MENU
   -------------------------------------*/
  const [anchorE, setAnchorE] = useState<null | HTMLElement>(null);
  const openN = Boolean(anchorE);
  const handleNMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE(event.currentTarget);
  };
  const handleNClose = () => {
    setAnchorE(null);
  };

  /**------------------------------
   * ACCOUNT MENU
   -------------------------------------*/
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**------------------------------
   * Handle Logout
   -------------------------------------*/
  //this calls logOut() to clear token in the store
  const handleLogout = async () => {
    await sendLogout();
  };

  /**------------------------------
   * NOTIFICATIONS
   -------------------------------------*/
  const { data: notifications, isFetching } = useGetNotificationsQuery(
    undefined,
    {
      pollingInterval: 60000 * 4, //in ms//4 min
      // refetchOnFocus: true,
      refetchOnMountOrArgChange: true, //in secs
    }
  );
  //store notif in store
  useEffect(() => {
    if (notifications) dispatch(setNotifications(notifications));
  }, [notifications]);

  //feedback-> logout
  useEffect(() => {
    //redirect user to home on success
    if (isSuccess) navigate("/");

    if (isError) toast.error(error as string);

    return () => toast.dismiss();
  }, [isError, isSuccess]);

  //drawer
  const drawerWidth = 280;

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  //close responsive drawer when user click a link
  const navigateTo = (link: string) => {
    //toggle/close drawer visible below < md
    handleDrawerToggle();
    //go to page
    navigate(link);
  };

  //responsive drawer-> md.down
  const drawer = (
    <Box>
      <Box display="flex" py={2} px={2} alignItems="center">
        <Typography
          component="span"
          variant="h4"
          sx={{
            flex: 1,
            cursor: "pointer",
          }}
          onClick={() => navigateTo("/")}
          id="logo"
        >
          Atwelia
        </Typography>
        <IconButton color="inherit" onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {PAGES.map(({ label, url }) => {
          return (
            <ListItem key={url} disablePadding onClick={(e) => navigateTo(url)}>
              <ListItemButton
                sx={{
                  px: 4,
                  color: pathname === url ? "primary.main" : "inherit",
                }}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "gray.main",
          px: 1,
          borderColor: "gray.border",
          borderStyle: "solid",
          borderWidth: "0 0 1px",
        }}
        // elevation={matches ? 1 : 0}
        elevation={0}
      >
        <Toolbar>
          <Box flexGrow={1} display="flex" alignItems="center">
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "dark.main", display: { md: "none" }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              component="span"
              variant="h4"
              sx={{
                cursor: "pointer",
                //fontSize: { xs: 28, xl: 34 },
                display: { xs: "none", md: "block" },
              }}
              onClick={() => navigate("/")}
              id="logo"
              color="secondary"
            >
              Atwelia
            </Typography>
          </Box>

          <Box display={{ xs: "none", md: "flex" }} flexGrow={8}>
            {PAGES.map(({ label, url }) => (
              <Button
                key={label}
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                  fontSize: 16,
                  color: pathname === url ? "primary.main" : "dark.main",
                }}
                size="large"
                onClick={() => navigate(url)}
              >
                {label}
              </Button>
            ))}
          </Box>
          <Box flexGrow={{ xs: 0, lg: 1, xl: 2 }}>
            <Tooltip title="Notifications">
              <IconButton
                sx={{ mr: 3 }}
                onClick={(e) =>
                  (notifications?.tours?.length ||
                    notifications?.inbox?.length) &&
                  handleNMenu(e)
                }
              >
                <Badge
                  badgeContent={
                    (notifications?.tours?.length || 0) +
                    (notifications?.inbox?.length || 0)
                  }
                  max={999} //default: 99
                  color="warning"
                  // overlap="circular"
                  //anchorOrigin={{ vertical: 'top',horizontal: 'right',}}//move the badge to any corner
                  // showZero
                >
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton
                onClick={handleMenu}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 30, height: 30, bgcolor: "dark.main" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorE}
        open={openN}
        onClose={handleNClose}
        onClick={handleNClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <NotificationsList notifications={notifications!} />
      </Menu>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* <MenuItem onClick={() => navigate("/payments")}>
          <ListItemIcon>
            <PaymentOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Payments" />
        </MenuItem> */}

        <MenuItem onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <PersonOutlinedIcon />
          </ListItemIcon>

          <ListItemText primary="Profile" />
        </MenuItem>

        <MenuItem onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            {isLoading ? (
              <CircularProgress size={20} color="secondary" />
            ) : (
              <Logout fontSize="small" color="secondary" />
            )}
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        PaperProps={{
          sx: {
            //bgcolor: "secondary.dark",
            //color: "dull.main",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default DashHeader;
