import { Typography } from "@mui/material";

type IntroProps = {
  children: JSX.Element | string;
} & Record<string, number | string>;

const Intro = ({ children, ...props }: IntroProps) => {
  return (
    <Typography fontWeight={500} variant="h5" gutterBottom pb={2} {...props}>
      {children}
    </Typography>
  );
};

export default Intro;
