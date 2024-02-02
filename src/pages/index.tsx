import { Flex, Stack } from "@chakra-ui/react";
import { MainContainer } from "../components/atoms/main-container";
import { FeedHead as Head } from "../components/atoms/feed-head";
import { Card } from "../components/organisms/card";
import { GetServerSideProps } from "next";
import { getFFUsers } from "./api/v1/users";
import { Users } from "@prisma/client";

export default function Feed({ users }: { users: Users[] }) {
  return (
    <>
      <Head />
      <Flex direction="column"  w="100vw" h="100vh" align="center" justify="center">
        <MainContainer align="center" justify="center">
          <Stack maxW={656} spacing="4" flex="1" minW="320px" alignItems="center">
            {users.map(u => (
              <Card
                data={{
                  image: u.image,
                  name: u.name,
                }}
              />
            ))}
          </Stack>
        </MainContainer>
      </Flex>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await getFFUsers();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    }
  }
}
