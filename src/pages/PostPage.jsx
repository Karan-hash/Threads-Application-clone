import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react";
import ActionLogos from "../components/ActionLogos";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import Comments from "../components/Comments";
const PostPage = () => {
    const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src='/zuck-avatar.png' size={"md"} name="Karan Kaushal" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              Karan Kaushal
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            1d
          </Text>
            <BsThreeDots />
          {/* {currentUser?._id === user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={handleDeletePost}
            />
          )} */}
        </Flex>
      </Flex>

      <Text my={3}>This is my first thread</Text>

        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src='/post1.png' w={"full"} />
        </Box>

      <Flex gap={3} my={3}>
        <ActionLogos liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          238 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          { 200 + ( liked ? 1 : 0 ) } likes
        </Text>
      </Flex>
      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Comments
      comment="Looks really good"
      createdAt="2d"
      likes={200}
      username="Karan Kaushal"
      userAvatar="https://bit.ly/prosper-baba"
      />
      <Comments
      comment=" good"
      createdAt="3d"
      likes={100}
      username="Varun Kaushal"
      userAvatar="https://bit.ly/code-beast"
      />
      <Comments
      comment="Sangeeta Kaushal"
      createdAt="2d"
      likes={50}
      username="Karan Kaushal"
      userAvatar="https://bit.ly/sage-adebayo"
      />
      {/* <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))} */}
    </>
  );
};
export default PostPage;
