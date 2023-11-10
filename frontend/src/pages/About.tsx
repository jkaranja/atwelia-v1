import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AOS from "aos";
import { useEffect } from "react";
import useTitle from "../hooks/useTitle";

const About = () => {
  useTitle("About");
  //animation on scroll
  useEffect(() => {
    AOS.init({
      // Global settings:
      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 120, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 600, // values from 0 to 3000, with step 50ms
      easing: "ease-in-sine", // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
    });
  }, []);

  return (
    <Grid2 container justifyContent="center" px={2}>
      <Grid2 xs lg={8} xl={7} data-aos="fade-up" py={2}>
        <Typography variant="h3" gutterBottom>
          About Us
        </Typography>
        <Box color="muted.dark" py={2}>
          <Typography gutterBottom paragraph>
            Atwelia is an online content and writer management system that helps
            clients manage their writers and content in an organized manner and
            in one place.
          </Typography>
          <Typography gutterBottom paragraph>
            With our system, you don't have to jump from one platform to another
            to carry out different tasks. Our platform has all the features that
            you need under one roof.
          </Typography>
          <Typography gutterBottom paragraph></Typography>
          <Typography gutterBottom paragraph>
            Our content and writer management system makes assigning and
            reviewing orders a piece of cake. Our inbuilt group and private
            chats, emailing feature, and email notifications ensure that you and
            your team are all up to date with what is going on.
          </Typography>
          <Typography gutterBottom paragraph>
            In addition, we don't ask for any payments or credit cards to start
            using the system. You get to enjoy all the features for free for 25
            days. Getting started is fast and simple. You can sign up, add
            writers, and assign orders in less than 4 minutes. Sounds great,
            right?
          </Typography>
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default About;
