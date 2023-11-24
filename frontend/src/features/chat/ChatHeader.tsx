import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import ListItemText from "@mui/material/ListItemText";

import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import { PROFILE_PIC_ROOT } from "../../constants/paths";
import { IUser } from "../../types/user";

type ChatHeaderProps = {
  recipient: IUser;
};

const ChatHeader = ({ recipient }: ChatHeaderProps) => {
 
  
  return (
    <Box py={0.5} px={2} display="flex" justifyContent="space-between">
      <ListItem disablePadding >
        <ListItemAvatar>
          <Avatar
            alt={recipient?.username}            
            src={`${PROFILE_PIC_ROOT}/${recipient.profile?.profilePic?.filename}`}

          />
        </ListItemAvatar>
        <ListItemText primary={recipient?.username} />
      </ListItem>
      <IconButton disabled>
        <MoreVertOutlinedIcon color="disabled" />
      </IconButton>
    </Box>
  );
};

export default ChatHeader;
