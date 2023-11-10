import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AOS from "aos";
import { useEffect } from "react";
import useTitle from "../hooks/useTitle";

const Privacy = () => {
  useTitle("Privacy policy");
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
          Privacy policy
        </Typography>
        <Box color="muted.dark">
          <Typography gutterBottom paragraph>
            Last Updated: September 1, 2023
          </Typography>
          <Typography gutterBottom paragraph>
            This Privacy Policy outlines how we collect, use, disclose, and
            safeguard your personal information. By using our platform, you consent
            to the practices described in this policy.
          </Typography>
          <Typography variant="h6" gutterBottom paragraph>
            1. Information We Collect
          </Typography>
          <Typography gutterBottom paragraph>
            a. User-Provided Information: When you create an account or list a
            property on our app or website, we collect personal information such as your
            name, email address, phone number, and property details.
          </Typography>
          <Typography gutterBottom paragraph>
            b. Property Information: This includes details about properties you
            list or inquire about, such as location, price, features, and
            images.
          </Typography>
          <Typography gutterBottom paragraph>
            c. Device Information: We may collect information about the device
            you are using, including but not limited to, the device type,
            operating system, unique device identifiers, and mobile network
            information.
          </Typography>
          <Typography gutterBottom paragraph variant="h6">
            2. Use of Your Information
          </Typography>
          <Typography gutterBottom paragraph>
            a. Property Listings: We use your information to display property
            listings, connect buyers and sellers, and facilitate
            property-related transactions.
          </Typography>
          <Typography gutterBottom paragraph>
            b. Communication: We may use your contact information to send you
            transactional messages, updates, and promotional offers related to
            our services.
          </Typography>
          <Typography gutterBottom paragraph>
            c. Improvement and Analysis: We use collected data to analyze user
            behavior, improve our app and site's functionality, and enhance user
            experience.
          </Typography>
          <Typography gutterBottom paragraph variant="h6">
            3. Sharing Your Information
          </Typography>
          <Typography gutterBottom paragraph>
            a. Property Listings: Your property information, including contact
            details, may be shared with potential buyers or renters.
          </Typography>
          <Typography gutterBottom paragraph>
            b. Legal Compliance: We may disclose your information when required
            by law, such as in response to legal requests or to protect our
            rights and interests.
          </Typography>
          <Typography gutterBottom paragraph variant="h6">
            4. Data Security
          </Typography>
          <Typography gutterBottom paragraph>
            We take reasonable measures to protect your personal information
            from unauthorized access, alteration, disclosure, or destruction.
          </Typography>
          <Typography gutterBottom paragraph variant="h6">
            5. Your Choices
          </Typography>
          <Typography gutterBottom paragraph>
            You may access, update, or delete your account information on the settings page. You can also contact us at support@atwelia.com
            for assistance.
          </Typography>

          <Typography gutterBottom paragraph variant="h6">
            6. Children's Privacy
          </Typography>
          <Typography gutterBottom paragraph>
            Our app and website are not intended for children under the age of
            13, and we do not knowingly collect personal information from
            children.
          </Typography>

          <Typography gutterBottom paragraph variant="h6">
            7. Third-Party Links
          </Typography>
          <Typography gutterBottom paragraph>
            Our app and website may contain links to third-party websites. We
            are not responsible for the privacy practices or content on these
            external sites.
          </Typography>
          <Typography gutterBottom paragraph variant="h6">
            8. Changes to this Privacy Policy
          </Typography>
          <Typography gutterBottom paragraph>
            We may update this Privacy Policy to reflect changes in our
            practices or legal requirements.
          </Typography>
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default Privacy;
