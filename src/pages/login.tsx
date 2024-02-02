import { Avatar, Button, Flex, Input, Select, Stack, Text, toast, useToast } from "@chakra-ui/react";
import { FeedHead as Head } from "../components/atoms/feed-head";
import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useState } from "react";
import { LoginButtonGreat } from "../components/organisms/login-button-great";
import { Users_role } from "@prisma/client";
import { AvatarUpload } from "../components/organisms/avatar-up";
import axios from "axios";
import useSessionStorage from "../states/hooks/use-session-storage";

export default function Login() {
  const router = useRouter();
  const [suser, setUser] = useState();
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [gender, setGender] = useState<string | undefined>();
  const [profileName, setProfileName] = useState<string | undefined>()
  const toast = useToast();
  const token = useSessionStorage('token', suser);

  const handleLogin = useCallback((user: any) => {
    if (user.role === Users_role.FURRY_FINDER_USER) {
      router.push('/');
    } else {
      setUser(user)
      setIsSignupMode(true)
    }
  }, [router]);

  const fn = (e: ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value)
  }

  const fnName = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileName(e.target.value)
  }


  const confirmChanges = async () => {
    console.log({ gender, profileName, token })
    try {
      if (!gender) {
        toast({ title: 'Por favor, preencha o seu gênero!', status: 'error' });
        return
      }

      if (!profileName) {
        toast({ title: 'Por favor, preencha o seu nickname!', status: 'error' });
        return
      }

      await axios.patch('/api/v1/users', {
        token,
        gender,
        profileName,
      });

      router.push('/');
    } catch (err) {
      toast({ status: 'error', title: 'falha ao criar seu usuario :/' })
    }
  }

  return (
    <>
      <Head />
      <Flex w="100vw" h="100vh">
        <Flex bg="url(./static/furry-finder-bkg.webp) no-repeat center" w="50vw" h="100vh"/>
        <Flex w="50vw" h="100vh" align="center" justify="center" flexDir="column">
          {isSignupMode ? (
            <Flex  justify="center" flexDir="column"
            w="100%"
            maxW={500}
            >
              <Stack spacing="4">
                <AvatarUpload user={suser}/>
              <Select placeholder='Selecione seu gênero' onChange={fn}>
                <option value='MALE'>Masculino</option>
                <option value='FEMALE'>Feminino</option>
                <option value='LGTV'>LGTV</option>
              </Select>
              <Input variant="outline" placeholder="Seu nickname" onChange={fnName}/>
              <Button onClick={confirmChanges}>
                Confirmar
              </Button>
              </Stack>
            </Flex>
          ) : (
            <Flex  justify="center" flexDir="column"
            w="100%"
            maxW={500}
            >
              <Text fontSize="7xl" fontWeight="bold" color="pink.400">
                Furry Finder 🦊
              </Text>
              <Text fontSize="3xl" fontWeight="medium" mb="4">
                Faça login para começar a encontrar <br/>furries magnificos!
              </Text>
              <LoginButtonGreat onSuccess={handleLogin}/>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}
