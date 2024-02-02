import { Flex, Stack } from "@chakra-ui/react";
import { MainContainer } from "../components/atoms/main-container";
import { FeedHead as Head } from "../components/atoms/feed-head";
import { Card } from "../components/organisms/card";
import { GetServerSideProps } from "next";
import { getFFUsers } from "./api/v1/users";
import { Users } from "@prisma/client";
import { useAuth } from "../states/hooks/use-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import useSessionStorage from "../states/hooks/use-session-storage";
import axios from "axios";

export default function Feed() {
  const { data } = useAuth();
  const router = useRouter();
  const token = useSessionStorage('token', data);

  useEffect(() => {
    if (!data?.user) {
      router.push('/login');
    }
  }, [data, router]);

  const { data: users = [], refetch } = useQuery('furry', async () => {
    if (token) {
      const { data } = await axios.get('/api/v1/users?token=' + token )
      return [data];
    }
    return [];
  });

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
                  name: u.profileName,
                  gender: u.gender,
                }}
              />
            ))}
          </Stack>
        </MainContainer>
      </Flex>
    </>
  );
}

