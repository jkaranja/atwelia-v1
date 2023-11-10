import {
  Button,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";



import Intro from "../../components/Intro";

type HowItWorksProps = {
  handleNext: () => void;
};

const HowItWorks = ({ handleNext }: HowItWorksProps) => {
  return (
    <Box p={2}>
      <Intro>Getting started as an agent and making money</Intro>

      <Typography paragraph>
        We're glad your interested in becoming an agent and start posting rentals. Let's answer a few
        questions you might have.
      </Typography>

      <Typography variant="h6" paragraph>
        How does it work?
      </Typography>
      <Typography paragraph>
        It's simple! You look for vacant houses in your area and post them on
        our platform(with landlord/owner's permission). 
      </Typography>

      <Typography paragraph>
        Then, anyone looking for a vacant room, will visit our platform and view
        all the listings you have posted. They will then send you a
        request to take them on a tour to see ALL the vacant rooms you have available.
      </Typography>

      <Typography variant="h6" paragraph>
        How will you earn money?
      </Typography>
      <Typography paragraph>
        After receiving the request, you will accept the request, take the
        client on a tour and they will pay you for your service.
      </Typography>

      <Typography variant="h6" paragraph>
        How much should you charge for the service?
      </Typography>
      <Typography paragraph>
        That will be up to you. The lower the fee, the more interested clients you will get. In the next step, you will fill the amount you
        will charge.
      </Typography>

      <Typography variant="h6" paragraph>
        How do we make money?
      </Typography>
      <Typography paragraph>
        You will be required to pay a commission of Ksh 100 for every
        successful tour. Make sure you include this commission when setting your
        tour fee.
      </Typography>

      <Typography variant="h6" paragraph>
        What's next?
      </Typography>
      <Typography paragraph>
        To start posting listings, you will need to create an agent profile.
        Click 'NEXT' below to create a profile.
      </Typography>

      <Box textAlign="right" py={4}>
        <Button onClick={handleNext} variant="contained">
          Next
        </Button>
      </Box>
    </Box>
  );
  
};

export default HowItWorks;
