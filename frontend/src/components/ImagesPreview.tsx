import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  IconButton,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useState } from "react";
import {
  DragDropContext,
  DragStart,
  Draggable,
  DropResult,
  Droppable,
  OnDragStartResponder,
} from "react-beautiful-dnd";
import convertBytesToKB from "../utils/convertBytesToKB";
import { useStrictDroppable } from "../hooks/useStrictDroppable";
import { IImage } from "../types/file";
import { IMAGE_ROOT } from "../constants/paths";

//reorder with react-beautiful-dnd
//https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/
//https://codesandbox.io/examples/package/react-beautiful-dnd //examples
//https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/types.md //types
//https://github.com/atlassian/react-beautiful-dnd/issues/2396 //fix issue due to strict mode

interface ImagesPreviewProps {
  selectedImages: IImage[];
  setSelectedImages: React.Dispatch<React.SetStateAction<IImage[]>>;
  acceptedFiles: IImage[];
  isLoading: boolean;
}

const ImagesPreview = ({
  selectedImages,
  setSelectedImages,
  acceptedFiles,
  isLoading,
}: ImagesPreviewProps) => {
  const [enabled] = useStrictDroppable();

  /* ----------------------
/REMOVE FILE FROM LIST
-------------------------*/
  const handleRemoveImage = (id: number) => {
    setSelectedImages((prev) => {
      return prev.filter((file, i) => i !== id);
    });
  };

  const handleOnDragEnd = (result: DropResult) => {
    //if someone doesn’t drag the item exactly within our defined containers, we get an error.
    //The issue is that when we drag it outside of the defined container, we don’t have a destination.
    //sol: we can simply add a statement above the code that moves our item around that checks if the destination exists, and if it doesn’t, exits out of the function:
    //now if user try to drag our item out again, our item snaps back to the original location without an error!
    if (!result.destination) return;
    //We create a new copy of our array because splice is a Mutating method i.e modify the original array
    const items = Array.from(selectedImages); //or use [...selectedImages]
    //We use the source.index value to find our item from our new array and remove it using the splice method
    //That result is destructured, so we end up with a new object of reorderedItem that is our dragged item
    const [reorderedItem] = items.splice(result.source.index, 1);
    //We then use our destination.index to add that item back into the array, but at it’s new location, again using splice
    items.splice(result.destination.index, 0, reorderedItem);
    //update our state
    setSelectedImages(items);
  };

  const handleOnDragStart: OnDragStartResponder = (start: DragStart) => {};

  return (
    <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={() => {}}>
      {enabled && (
        <Droppable droppableId="preview">
          {(dropProvided, dropSnapshot) => (
            <ImageList
              ref={dropProvided.innerRef}
              {...dropProvided.droppableProps}
              sx={{
                maxHeight: 380,
                pb: 2,
                bgcolor: dropSnapshot.isDraggingOver ? "dull.main" : "",
              }}
              cols={4} //Default:2//Number of columns.
              rowHeight={110} //The height of one row in px.//Default:'auto'
              // variant="quilted" //use item cols&rows to span multiple row/cols//emphasize certain items over others in a collection.i.e give some images more cols
              //variant='standard'//Default
              gap={8} //Default:4//The gap between items in px.
            >
              {selectedImages.map((file, index) => {
                const cols = index % 2 ? 2 : 1;
                // const rows = item.featured ? 2 : 1;
                const url = !file.filename && URL.createObjectURL(file as File);
                return (
                  <Draggable
                    key={`${file.name || file.filename}`}
                    index={index} //must be added
                    draggableId={`${file.name || file.filename}`} //must be added
                  >
                    {(dragProvided, dragSnapshot) => (
                      <ImageListItem
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        sx={{
                          border: dragSnapshot.isDragging ? 1 : 0,
                          borderStyle: "dashed",
                          cursor: "grab", //not showing initially until you start moving
                        }}
                        // cols={cols}
                        // rows={cols}
                        // cols={cols}//can span multiple row->quilted//default: 1/Width of the item in number of grid columns.//if ImageList col=2, giving image col=2 will span whole row
                        //rows={item.rows || 1}//can span multiple row->quilted////default: 1//Height of the item in number of grid rows.
                      >
                        <Box>
                          <img
                            src={url || `${IMAGE_ROOT}/${file.filename}`} //File or Fetched file url
                            srcSet={url || `${IMAGE_ROOT}/${file.filename}`}
                            alt={file.name || file.filename}
                            loading="lazy"
                            height={110}
                            width="100%"
                            style={{ objectFit: "cover" }}
                          />
                        </Box>

                        <ImageListItemBar
                          title={
                            <Typography
                              component="span"
                              // color="muted.dark"
                              variant="body2"
                            >
                              {/* {file.name.length > 32
                        ? `${file.name.slice(0, 28).trim()}...${file?.name
                            ?.split(".")
                            .pop()}`
                        : file.name} */}
                            </Typography>
                          }
                          //position="below"//The title bar can be placed below the image
                          subtitle={
                            <Typography
                              component="span"
                              // color="muted.dark"
                              variant="body2"
                            >
                              {convertBytesToKB(file.size)} kb
                            </Typography>
                          }
                          actionIcon={
                            <IconButton
                              sx={{ color: "rgba(255, 255, 255, 1)" }}
                              onClick={() => handleRemoveImage(index)}
                            >
                              <CloseIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    )}
                  </Draggable>
                );
              })}

              {acceptedFiles.length > 0 &&
                isLoading &&
                acceptedFiles.map((file, i) => (
                  <ImageListItem key={`${file.name}` + i}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height={110}
                      width="100%"
                      bgcolor="dull.main"
                    >
                      <CircularProgress color="inherit" />
                    </Box>
                  </ImageListItem>
                ))}
              {dropProvided.placeholder}
            </ImageList>
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
};

export default ImagesPreview;
