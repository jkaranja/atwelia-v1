import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Collapse,
  DialogContentText,
  FormControl,
  Grow,
  IconButton,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import React, { useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { addDays, addHours, format, startOfDay } from "date-fns";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      //width: 250,
    },
  },
};

const DATES = [...Array(8)].map((_, i) =>
  addDays(addHours(startOfDay(new Date()), 7), i)
);

type DatePickerProps = {
  datesPicked: Date[];
  setDatesPicked: React.Dispatch<React.SetStateAction<Date[]>>;
};

const DatePicker = ({ setDatesPicked, datesPicked }: DatePickerProps) => {
  const [time, setTime] = useState("0");

  //check for date match//day of month will be unique for given dates but same when original date time part is updated
  const isDateSelected = (date: Date) => {
    return datesPicked.some((current) => current.getDate() === date.getDate());
  };

  //add or remove picked dates
  const handleDateClick = (date: Date) => {
    if (isDateSelected(date)) {
      return setDatesPicked((prev) =>
        prev.filter((elem) => elem.getDate() !== date.getDate()) 
      );
    }

    return setDatesPicked((prev) => [...prev, date]);
  };

  //update time for specific date
  const handleTimeChange = (event: SelectChangeEvent, date: Date) => {
    setTime(event.target.value);

    //update date with new time
    const newDates = datesPicked.map((selectedDate) => {
      if (selectedDate.getDate() === date.getDate()) {
        //reset day: selected date could have a diff time than initial date//ignore it and use initial date(starts at 7am)
        const updatedDate = addHours(date, parseInt(event.target.value));

        return updatedDate;
      }

      return selectedDate; // return other selected dates untouched
    });

    setDatesPicked(newDates);
  };

  return (
    <Box
      display="flex"
      overflow="auto"
      columnGap={2}
      pt={3}
      pb={4}
      mb={2}
      alignItems="flex-start"
      justifyContent="space-between"
    >
      {DATES.map((date, i) => (
        <Card variant="outlined" key={i} sx={{ minWidth: 150 }}>
          <CardActionArea
            onClick={() => handleDateClick(date)}
            sx={{
              borderRadius: 0,
              bgcolor: isDateSelected(date) ? "dark.main" : "",
              color: isDateSelected(date) ? "white" : "",
            }}
          >
            <CardHeader
              title={
                <Typography variant="body1" gutterBottom>
                  {format(date, "E")}
                </Typography>
              }
              subheader={
                <Typography variant="h5">{format(date, "dd MMM")}</Typography>
              }
              // sx={{ pb: 0 }}
            />
          </CardActionArea>

          {isDateSelected(date) && (
            <CardActions>
              <AccessTimeIcon fontSize="small" sx={{ color: "primary.main" }} />
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 90 }}
                size="small"
              >
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={time}
                  label="Time"
                  onChange={(e) => handleTimeChange(e, date)}
                  //autoWidth
                  //input//
                  //open
                  MenuProps={MenuProps}
                  renderValue={(value) =>
                    format(
                      datesPicked.find(
                        (current) => current.getDate() === date.getDate()
                      )!,
                      "hh:mm a"
                    )
                  }
                >
                  {[...Array(14)].map((_, i) => (
                    <MenuItem value={i}>
                      {format(addHours(date, i), "hh:mm a")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardActions>
          )}
        </Card>
      ))}
    </Box>
  );
};

export default DatePicker;
