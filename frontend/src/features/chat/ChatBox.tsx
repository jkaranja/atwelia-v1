import { Button, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageForm from "./MessageForm";
import MessageItem from "./MessageItem";
import { IChat, IMessage, useGetMessagesQuery } from "./chatApiSlice";
import { IUser } from "../../types/user";

type ChatBoxProps = {
  chat: IChat;
  recipient: IUser;
};

const ChatBox = ({ chat, recipient }: ChatBoxProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [messagesList, setMessagesList] = useState<IMessage[]>([]);

  /* -------------------------------------------------------------
   FETCH CHAT
   ----------------------------------------------------------------*/
  const {
    currentData: data,
    isFetching,
    isLoading,
    isError,
  } = useGetMessagesQuery(
    { itemsPerPage, page, id: chat._id },
    {
      skip: !chat,
      //pollingInterval: 1000,
      // refetchOnFocus: true,
      refetchOnMountOrArgChange: 50, //refetch if 5o secs have passed since last refresh
    }
  );

  useEffect(() => {
    //note, you can't mutate data.message directly(or assigning it to a new var->will still point to same array reference) which is a readonly state returned by useQuery hook-> redux store state
    //sol: create a copy first before trying to modify the original array. use spread operator or Array.from()
    const fetchedMessages = Array.from(data?.messages || []).reverse(); //

    setMessagesList((prev) => [...fetchedMessages, ...prev]);
    setTotalPages(data?.pages || 0);
  }, [data]);

  /* ----------------------------------------
   //load earlier
   ----------------------------------------*/
  const handleLoadEarlier = () => {
    if (!isError) return setPage((prev) => prev + 1);
  };

  //scroll to bottom
  useEffect(() => {
    if (messagesList.length) {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messagesList.length]);

  if (isLoading)
    return (
      <Box
        height="65vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="warning" size={50} />
      </Box>
    );

  return (
    <Box position="relative" height="70vh">
      <Box
        overflow="auto"
        minHeight="62vh"
        maxHeight="62vh"
        bgcolor="dull.main"
        pb={10}
      >
        {!isError && (
          <Box textAlign="center" pt={1}>
            <Button
              sx={{ textTransform: "none", textDecoration: "underline" }}
              size="small"
              onClick={handleLoadEarlier}
            >
              Load earlier messages
            </Button>
          </Box>
        )}

        {messagesList?.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            setMessagesList={setMessagesList}
          />
        ))}

        <Box ref={scrollRef} />
      </Box>
      <Box position="absolute" bottom={0} width="100%" p={2}>
        <MessageForm recipient={recipient} setMessagesList={setMessagesList} />
      </Box>
    </Box>
  );
};

export default ChatBox;
