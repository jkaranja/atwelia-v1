import styled from "@emotion/styled";
import Tab from "@mui/material/Tab";

//custom tab
const MyTab = styled(Tab)(() => ({
  textTransform: "none",
  padding: "1px",
  marginBottom: "2px",
  marginRight: 40,
  minWidth: 0,
  alignItems: "start",
}));

export default MyTab;
