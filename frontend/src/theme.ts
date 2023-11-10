import { createTheme } from "@mui/material";

export const themeSettings = (prefersDarkMode: boolean) => {
  // Create a theme instance.
  const theme = createTheme({
    //palette colors can be accessed as color ='primary' or bg color: "primary.main/light/dark"(just primary won't work here)
    palette: {
      //mode: prefersDarkMode ? "dark" : "light",
      primary: {
        // light: will be calculated from palette.primary.main,
        // main: "#1976d2",
        // dark: will be calculated from palette.primary.main,
        contrastText: "#fff", // will be calculated to contrast with palette.primary.main
        //custom
        light: "#21de9a", //#51c28c//#3db379//rgba(61,179,121,255)
        main: "#3ac794", //#04b674//#09757a//rgba(0,165,81,255)//#00b973//not making color white
        dark: "#00a85c", //#00a85c//#00a551//rgba(0,185,115,255)
      },
      error: {
        //main: "#d32f2f",
        //custom
        light: "#e43b66", //rgba(61,179,121,255)
        main: "#de194e", ////rgba(0,165,81,255)
        dark: "#b91048", //rgba(0,185,115,255)
      },
      info: {
        main: "#0288d1",
      },
      success: {
        main: "#2e7d32",
      },
      secondary: {
        // main: "#9c27b0",
        //custom
        //main: "#673ab7",
        //custom
        light: "#242145", //same as footer
        main: "rgb(16, 24, 40)", //dark color
      },

      warning: {
        main: "#ed6c02",
      },

      //divider: "rgb(242, 244, 247)", //custom divider color for tabs//pre-defined

      // Provide every color token (light, main, dark, and contrastText)//optional/main only is ok// when using
      // custom colors for props in Material UI's components.
      // Then you will be able to use it like this: `<Button color="custom">`//in others as custom.main
      // (For TypeScript, you need to add module augmentation for the `custom` value)
      //you can call custom.dark or .light in other props or sx//not in color prop
      custom: {
        light: "#ffa726",
        main: "#f57c00",
        dark: "#ef6c00",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
      muted: {
        main: "rgba(0, 0, 0, 0.6)",
        dark: "rgb(102, 112, 133)", //darker muted
      },
      //dull background//don't use grey, already defined in Material UI somewhere
      gray: {
        main: "#FCFCFD", //rgb(249, 250, 251) //#F4F5FA -> grayer
        dark: "rgb(158, 158, 158)", //for progress/spinner
        light: "rgba(58, 53, 65, 0.6)", //lighter gray on gray background
        border: "rgba(58, 53, 65, 0.22)",
      },
      //lavender//eg in iconBtn background/light->use for card/table/charts border
      dull: {
        main: "#f0f1fd",
        light: "rgb(242, 244, 247)",
      },

      //disabled color
      disabled: {
        main: "rgba(0, 0, 0, 0.26)",
      },
      //dark text
      dark: {
        main: "rgb(16, 24, 40)",
      },
    },

    typography: {
      h1: {
        fontWeight: 700,
      },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 500 },
      h4: { fontWeight: 500 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
      body1: {},
      body2: {},
      subtitle1: { fontWeight: 500 },
      subtitle2: {},
    },
    //can also add color outside of pallette//but you will have to get it manually
    //const theme = useTheme();
    // const status = theme.status.danger;
    status: {
      danger: "red",
    },
  });

  return theme;
};
