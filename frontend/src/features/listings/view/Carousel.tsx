import {
  Box,
  Button,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// core version + navigation + pagination + other modules:
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules"; //for version > 10.0.0

//import { Autoplay, EffectFade, Navigation, Pagination } from "swiper"; //for version > 10.0.0
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { IMAGE_ROOT } from "../../../constants/paths";
import { IImage } from "../../../types/file";
import { selectCurrentToken } from "../../auth/authSlice";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useLocation } from "react-router-dom";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";

type CarouselProps = {
  images: IImage[];
  currentIndex: number;
  open: boolean;
  handleClose: () => void;
};

const Carousel = ({
  images,
  open,
  handleClose,
  currentIndex,
}: CarouselProps) => {
  const token = useAppSelector(selectCurrentToken);
  const { pathname, search } = useLocation();

  const [activeIndex, setActiveIndex] = useState(currentIndex || 0);

  const maxItems = images.length;

  //handle next btn
  const handleNext = () => {
    if (activeIndex === maxItems - 1) return setActiveIndex(0); //loop from start
    setActiveIndex((prev) => prev + 1);
  };

  //handle back btn
  const handleBack = () => {
    if (activeIndex === 0) return setActiveIndex(maxItems - 1); //loop from end
    setActiveIndex((prev) => prev - 1);
  };

  return (
    <Dialog
      fullWidth //works together with max width
      maxWidth="xl" //default is small
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title" sx={{ p: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography p={2} variant="h5">
            Photos
          </Typography>
          <IconButton size="large" color="default" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box
          display="flex"
          justifyContent="space-between"
          bgcolor="secondary.main"
          minHeight="85vh"
          alignItems="center"
          columnGap={3}
        >
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{ minWidth: 5, px: 1, py: 1, borderRadius: "0 3px 3px 0" }}
          >
            <ArrowBackIosRoundedIcon fontSize="large" />
          </Button>

          <Box flexGrow={2}>
            <img
              src={`${IMAGE_ROOT}/${images[activeIndex]?.filename}`}
              alt={images[activeIndex]?.filename}
              width="100%"
              style={{ objectFit: "cover", height: "70vh" }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ minWidth: 5, px: 1, py: 1, borderRadius: "3px 0 0 3px" }}
          >
            <ArrowForwardIosRoundedIcon fontSize="large" color="inherit" />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Carousel;
