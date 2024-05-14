import { Flex, useColorMode, Image } from "@chakra-ui/react";
export default function Headers() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={"center"} mt={6} mb='12'>
      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/logo-image-light.svg" : "/logo-image-dark.svg"}
        onClick={toggleColorMode}
      />
    </Flex>
  );
}
