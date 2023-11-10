import { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { IconButton, ImageListItemBar, Box } from "@mui/material";
import { IImage } from "../types/file";
import { IMAGE_ROOT } from "../constants/paths";
import Carousel from "../features/listings/view/Carousel";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

type ListingImageListProps = {
  images: IImage[];
};

export default function ListingImageList({ images }: ListingImageListProps) {
  const [openCarouselD, setOpenCarouselD] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("lg"));

  const handleToggleCarouselD = () => {
    //reset current index on close
    if (openCarouselD) setCurrentIndex(-1);

    setOpenCarouselD((prev) => !prev);
  };

  const handleClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    //prevent opening modal on mount & (on index reset/close) 
    if (!openCarouselD && currentIndex !== -1) handleToggleCarouselD();
  }, [currentIndex]);

  return (
    <Box>
      {openCarouselD && (
        <Carousel
          open={openCarouselD}
          handleClose={handleToggleCarouselD}
          images={images}
          currentIndex={currentIndex}
        />
      )}
      <ImageList
        // sx={{ width: 800, height: 700 }}
        cols={matches ? 1 : 2} //Default:2//Number of columns.
        rowHeight={400} //The height of one row in px.//Default:'auto'
        variant="quilted" //use item cols&rows to span multiple row/cols//emphasize certain items over others in a collection.i.e give some images more cols
        //variant='standard'//Default //don't pass cols/rows in item
        //variant= woven //don't pass cols/rows in item//oven image lists use alternating container ratios to create a rhythmic layout.
        //variant="masonry"//don't pass cols/rows in item//Masonry image lists use dynamically sized container heights that reflect the aspect ratio of each image.//uses image original aspect ration
        //gap={8}//Default:4//The gap between items in px.
      >
        {images.map((item, i) => {
          //const cols = i % 2 ? 2 : 1;
          const cols = i === 0 ? 2 : 1;
          // const rows = item.featured ? 2 : 1;
          return (
            <ImageListItem
              onClick={() => handleClick(i)}
              sx={{ cursor: "pointer" }}
              key={`${item.filename}` + i}
              //cols={cols}
              // rows={cols}
              // cols={cols}//can span multiple row->quilted//default: 1/Width of the item in number of grid columns.//if ImageList col=2, giving image col=2 will span whole row
              //rows={item.rows || 1}//can span multiple row->quilted////default: 1//Height of the item in number of grid rows.
            >
              <img
                src={`${IMAGE_ROOT}/${item.filename}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${IMAGE_ROOT}/${item.filename}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.filename}
                loading="lazy"
              />
              <ImageListItemBar
                //title={item.filename}
                //position="below"//The title bar can be placed below the image//'below' | 'bottom' | 'top'
                //subtitle={item.author}
                //actionPosition//Position of actionIcon IconButton. //'left' | 'right'
                //actionIcon: An IconButton element to be used as secondary action target
                actionIcon={
                  <IconButton
                    sx={{ color: "rgba(255, 255, 255, 0.74)" }}
                    aria-label={`info about ${item.filename}`}
                    // onClick={handleToggleCarouselD}
                  >
                    <OpenInFullOutlinedIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          );
        })}
      </ImageList>
    </Box>
  );
}
