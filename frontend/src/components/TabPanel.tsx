import { Typography } from "@mui/material";
import { Box } from "@mui/system";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number | string;
  value: number | string;
}
//custom tab panel
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
