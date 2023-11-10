import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  MenuList,
  useScrollTrigger,
  CircularProgress,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AuthDialog from "../features/auth/AuthDialog";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectCurrentToken } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

//ALternative to this responsive component behaves is to have links change into icons
//good for dashboard nav// while main nav is hidden when loggged in
//another is to make it responsive using a menu instead of drawer
//All of them are using display: { xs: "none", sm: "block" } and vice versa to hide and show
//and hide/ swap// you will have two menus//one to start with//other in the drawer/menu/icons
//the toggle btn//menu toggler is using display: { sm: "none" }//hidden from sm and up//visible
//from sm and down

const MENUITEMS = [
  { url: "/listings", title: "Post a rental" },
  { url: "/listings", title: "My listings" },
  // { url: "/tours", title: "Tours" },
  { url: "/messages", title: "Messages" },
];

/**------------------------------------
 * PAGES
 ----------------------------------*/
const PAGES = [
  { label: "Favorites", url: "/favorites" },
  { label: "Contact", url: "/contact" },
  { label: "Log in", url: "/login" },
  { label: "Sign up", url: "/signup" },
];

const Header = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true, //required//if not added/false, trigger is only true when you scroll down and false when up
    threshold: 20, //default is 100px//detect when you scroll down and hit min of 100 from top//becomes true
  });

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const token = useAppSelector(selectCurrentToken);
  //auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  //dialogs
  const [openAuthD, setOpenAuthD] = useState(false);
  const handleToggleAuthD = () => setOpenAuthD((prev) => !prev);

  //logout mutation
  const [sendLogout, { data, error, isLoading, isError, isSuccess }] =
    useSendLogoutMutation();
  /**------------------------------
   * Handle Logout
   -------------------------------------*/
  //this calls logOut() to clear token in the store
  const handleLogout = async () => {
    await sendLogout();
  };

  //the drawer responsiveness is relying on sx = {{display:{sm: "none"/block}}} //i.e hide and show

  //rental menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //drawer
  const drawerWidth = 280;

  const [mobileOpen, setMobileOpen] = useState(false);

  // const handleDrawerToggle = () => {
  //   setMobileOpen((prevState) => !prevState);
  // };
  const handleCloseDrawer = () => {
    setMobileOpen(false);
  };

  const handleOpenDrawer = () => {
    setMobileOpen(true);
  };

  //close responsive drawer when user click a link
  const navigateTo = (link: string) => {
    //toggle/close drawer visible below < md
    handleCloseDrawer();
    //go to page
    navigate(link);
  };

  //menu navigation
  const handleMenuItemClick = (url: string) => {
    setRedirectUrl(url);

    if (!token) return handleToggleAuthD();

    navigateTo(url); //use navigateTo instead of navigate. not needed for menu. Only list items in drawer(for closing drawer)
  };

  //auth & retry
  useEffect(() => {
    if (token && isAuthenticated) {
      handleToggleAuthD();
      handleMenuItemClick(redirectUrl);
    }
  }, [token, isAuthenticated]);

  const drawer = (
    <Box>
      <Box display="flex" py={2} px={2}>
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
        <IconButton color="inherit" onClick={handleCloseDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Accordion defaultExpanded disableGutters elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="Manage listings" />
        </AccordionSummary>
        <AccordionDetails
          sx={{
            //p: 0,
            px: 2,
            borderTop: 1,
            borderBottom: 1,
            borderColor: "gray.border",
          }}
        >
          {MENUITEMS.map(({ url, title }, index) => (
            <ListItemButton
              key={title + index}
              onClick={() => handleMenuItemClick(url)}
            >
              <ListItemText primary={title} />
            </ListItemButton>
          ))}
        </AccordionDetails>
      </Accordion>

      {PAGES.map(({ label, url }) => {
        if (token && (label === "Sign up" || label === "Log in")) return;
        return (
          <ListItem key={url} disablePadding>
            <ListItemButton
              onClick={(e) =>
                url === "/favorites"
                  ? handleMenuItemClick(url)
                  : navigateTo(url)
              }
            >
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        );
      })}

      {token && (
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Logout fontSize="small" color="inherit" />
            )}
            <ListItemText primary="Log out" />
          </ListItemButton>
        </ListItem>
      )}
    </Box>
  );

  return (
    <Box
      sx={{ display: "flex" }}
      id="nav-bar"
      // className={trigger || pathname !== "/" ? "active" : ""}
    >
      {openAuthD && (
        <AuthDialog
          open={openAuthD}
          handleClose={handleToggleAuthD}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

      <AppBar
        component="nav"
        elevation={pathname !== "/" ? 0 : 0}
        position="sticky"
        //color="transparent"
        sx={{
          bgcolor: "#fff",
          px: 2,
          borderColor: "gray.border",
          borderStyle: "solid",
          borderWidth: "0 0 1px",
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleOpenDrawer}
            sx={{ mr: 2, color: "dark.main", display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="span"
            variant="h4"
            color="secondary"
            sx={{
              mr: "auto",
              // color: "white",
              display: {
                xs: "none",
                md: "block",
              },
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
            id="logo"
          >
            Atwelia
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleClick}
              sx={{
                textTransform: "none",
                fontWeight: "normal",
                fontSize: 16,
                color: "dark.main",
              }}
              //color="primary"
              size="large"
              endIcon={<ExpandMoreIcon />}
              //onMouseEnter={(e) =>handleClick(e)}
              // onMouseLeave={() => handleClose()} //causing flickering-> see Menu
              // onMouseOver={!url ? handleClick : () => {}}//use this for hover
            >
              Manage listings
            </Button>
            {PAGES.map(({ label, url }) => {
              if (token && (label === "Sign up" || label === "Log in")) return;
              return (
                <Button
                  key={label}
                  onClick={(e) =>
                    url === "/favorites"
                      ? handleMenuItemClick(url)
                      : navigate(url)
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: "normal",
                    fontSize: 16,
                    color: "dark.main",
                  }}
                  //color="primary"
                  size="large"
                >
                  {label}
                </Button>
              );
            })}

            {token && (
              <Button
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                  fontSize: 16,
                  color: "dark.main",
                }}
                size="large"
                onClick={handleLogout}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Logout fontSize="small" color="inherit" />
                  )
                }
              >
                Log out
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ width: 400 }}
        //MenuListProps={{}}//passed to menulist->use to set eg width
        // MenuListProps={{ onMouseLeave: handleClose }}//use this for hover
      >
        <MenuList sx={{ minWidth: 200 }} disablePadding>
          {MENUITEMS.map(({ url, title }, index) => (
            <MenuItem
              key={url + index}
              //divider
              //disableG..//dense//or use <MenuList> and pass this(same List) props
              onClick={() => handleMenuItemClick(url)}
            >
              <ListItem>
                <ListItemText primary={title} />
              </ListItem>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleCloseDrawer}
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

export default Header;
