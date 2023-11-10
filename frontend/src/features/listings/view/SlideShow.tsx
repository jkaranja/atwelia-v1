import { Box, IconButton, Button } from "@mui/material";
// core version + navigation + pagination + other modules:
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";
// Import Swiper styles
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { IMAGE_ROOT } from "../../../constants/paths";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { IImage } from "../../../types/file";
import { selectCurrentToken } from "../../auth/authSlice";
import { useState } from "react";

type SlideshowProps = {
  images: IImage[];
};

const Slideshow = ({ images }: SlideshowProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

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
    <Box
      display="flex"
      justifyContent="space-between"
      bgcolor="secondary.main"
      minHeight="30vh"
      alignItems="center"
      columnGap={1}
    >
      <Button
        variant="contained"
        onClick={handleBack}
        size="small"
        sx={{ minWidth: 5, px: 0, py: 1, borderRadius: "0 3px 3px 0" }}
      >
        <ArrowBackIosRoundedIcon fontSize="large" />
      </Button>

      <Box flexGrow={2}>
        <img
          src={`${IMAGE_ROOT}/${images[activeIndex]?.filename}`}
          alt={images[activeIndex]?.filename}
          width="100%"
          style={{ objectFit: "cover", height: "25vh" }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleNext}
        size="small"
        sx={{ minWidth: 5, padding: 0, py: 1, borderRadius: "3px 0 0 3px" }}
      >
        <ArrowForwardIosRoundedIcon fontSize="large" color="inherit" />
      </Button>
    </Box>
  );
};

export default Slideshow;
