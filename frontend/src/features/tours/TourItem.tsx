import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { format } from "date-fns";
import { ITour } from "../../types/tour";


type TourItemProps = {
  tour: ITour;
  handleChecked: (id: number) => void;

};

const TourItem = ({ tour, handleChecked,  }: TourItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <TableRow
      //key={tour._id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      //hover
      //role="checkbox"
      //selected={isItemSelected}
      //onClick
    >
      <TableCell padding="checkbox" align="left">
        <Box
          sx={{ display: "flex" }}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Checkbox
          //checked={tour.isChecked ? order.isChecked : false}
          //onChange={() => handleChecked(order.orderId)}
          />
          <Typography
            component="span"
            color="secondary"
            // onClick={() =>
            //   navigate(`/orders/view/${order.orderId}`, {
            //     state: { from: location },
            //   })
            // }
            sx={{ cursor: "pointer" }}
          >
            #{tour._id}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>{format(new Date(tour.tourDate), "dd MMM, yyyy")}</TableCell>

      <TableCell>{format(new Date(tour.updatedAt), "dd MMM, yyyy")}</TableCell>
      <TableCell>
        <Chip
          label={tour.tourStatus}
          color="warning"
          variant="outlined"
          size="small"
        />
      </TableCell>
      <TableCell>
        <Chip
          //label={`${order.effect}/=`}
          // color={order.effect > 0 ? "success" : "error"}
          variant="outlined"
          size="small"
        />
      </TableCell>

      <TableCell align="center">
        <IconButton
          color="secondary"
          onClick={
            () => console.log
            // navigate(`/orders/completed/${order.orderId}`, {
            //   state: { from: location },
            // })
          }
        >
          <ExitToAppIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default TourItem;
