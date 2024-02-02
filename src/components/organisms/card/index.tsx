import { Box, Flex, Text, Divider, Icon, Image, Button, FlexProps, Stack, HStack, Tooltip } from "@chakra-ui/react";
import { ElementContainer } from "../../atoms/element-container";
import { dracula } from "../../../styles/theme";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoMdMale } from "react-icons/io";
import { useMemo } from "react";
import { Gender } from "@prisma/client";
import { IoMaleFemale, IoFemale } from "react-icons/io5";

const flexStyled = {
  border: "2px solid transparent",
  maxWidth: "260px",
  transition: "0.2s",
  _hover: {
    transform: 'scale(1.01)',
    border: `2px solid ${dracula.Purple}`,
  }
}

type CardProps = {
  data: {
    image: string
    name: string
    gender: string
  }
} & FlexProps;

export function Card({
  data: { image, name, gender },
  ...props
}: CardProps) {

  const genderIcon = useMemo(() => {
    switch (gender) {
      case Gender.FEMALE:
        return IoFemale
      case Gender.MALE:
        return IoMdMale
      default:
        return IoMaleFemale
    }
  }, [gender]);

  return (
    <ElementContainer
      size="sm"
      stackProps={{ padding: '0', margin: '0', ml: '0' }}
      {...flexStyled}
      {...props}
      m="2"
    >
      <Flex h="100%" direction="column" w="100%"
       position="relative"
      >
        <Box borderRadius="6" w="100%" h="260px" overflow="hidden" bg="#fff">
          <Image
            boxSize='100%'
            objectFit="cover"
            src={image}
            alt={name}
            mb="2"
          />
        </Box>
        <Flex mt="4" align="center">
          <Text fontWeight="medium">
            {name}
          </Text>
          <Icon as={genderIcon} ml="2"/>
        </Flex>
        <Divider orientation="horizontal" w="100%" mt="4" mb="4" />
        <HStack spacing={2}>
          <Button w="100%" bg="green.400">
            <Icon as={FaCheck} />
          </Button>
          <Button w="100%" bg="red.400">
            <Icon as={FaTimes}/>
          </Button>
        </HStack>
      </Flex>
    </ElementContainer>
  );
}
