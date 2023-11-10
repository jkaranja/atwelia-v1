import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";

const NotFound = () => {
  useTitle("Not found");

  const navigate = useNavigate();
  return (
    <Box textAlign="center">
      <Typography variant="h1">404</Typography>
      <Typography variant="h6" paragraph>Page Not Found</Typography>
      <Typography variant="body1" color="muted.dark">
        We couldn't find the page you are looking for.
      </Typography>

      <Typography variant="body1" my={8}>
        <Button
          color="secondary"
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
        >
          Back to home
        </Button>
      </Typography>
    </Box>
  );
};

export default NotFound;
