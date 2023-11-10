import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AOS from "aos";
import { useEffect } from "react";
import useTitle from "../hooks/useTitle";

const Terms = () => {
  useTitle("Terms of use");
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
      <Grid2 xs={12} md={5} data-aos="zoom-in" py={2}>
        <Typography variant="h3" gutterBottom>
          Terms of use
        </Typography>
        <Box color="muted.dark">
          <Typography gutterBottom paragraph>
            Last Updated: September 1, 2023
          </Typography>
          <Typography gutterBottom paragraph>
            These Terms of Service ("Terms") govern your use of our platform,
            and by accessing or using our platform, you agree to be bound by
            these Terms. Please read them carefully.
          </Typography>
          <Typography variant="h6" gutterBottom paragraph>
            1. Acceptance of Terms
          </Typography>
          <Typography gutterBottom paragraph>
            By accessing or using our Site, you agree to comply with and be
            bound by these Terms. If you do not agree with these Terms, please
            refrain from using our platform.
          </Typography>
          <Typography gutterBottom paragraph variant="h6">
            2. User Eligibility
          </Typography>
          <Typography gutterBottom paragraph>
            You must be at least 18 years old to use our services. By using our
            platform, you confirm that you are of legal age.
          </Typography>

          <Typography gutterBottom paragraph variant="h6">
            3. Listing and Posting Guidelines
          </Typography>
          <Typography gutterBottom paragraph>
            a. Property Listings: When you post a property listing on our Site,
            you agree to provide accurate and up-to-date information about the
            property.
          </Typography>
          <Typography gutterBottom paragraph>
            b. Prohibited Content: You may not post or promote any content that
            is illegal, fraudulent, misleading, discriminatory, or violates any
            applicable laws or regulations.
          </Typography>
          <Typography gutterBottom paragraph variant="h6">
            4. Privacy
          </Typography>
          <Typography gutterBottom paragraph>
            Our Privacy Policy governs the collection, use, and sharing of your
            personal information. By using our platform, you consent to our
            Privacy Policy.
          </Typography>

          <Typography gutterBottom paragraph variant="h6">
            5. User Conduct{" "}
          </Typography>
          <Typography gutterBottom paragraph>
            a. You agree to use our platform in a lawful and respectful manner.
          </Typography>
          <Typography gutterBottom paragraph>
            b. You may not engage in any activity that disrupts or interferes
            with the proper functioning of our platform.
          </Typography>
          <Typography gutterBottom paragraph variant="h6">
            6. Intellectual Property
          </Typography>
          <Typography gutterBottom paragraph>
            All content and materials on our platform, including logos,
            trademarks, and typography, are protected by intellectual property
            laws. You may not use, reproduce, or distribute these materials
            without our written consent.
          </Typography>
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default Terms;
