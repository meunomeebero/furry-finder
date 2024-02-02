import { Flex, Avatar, useToast } from "@chakra-ui/react";
import axios from "axios";
import { FormEvent, useState, useCallback } from "react";
import { useAuth } from "../../../states/hooks/use-auth";
import useSessionStorage from "../../../states/hooks/use-session-storage";

export function AvatarUpload({ user }) {
  const auth = useAuth();
  const token = useSessionStorage('token', auth);
  const toast = useToast();
  const [avatar, setAvatar] = useState(user.image);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateAvatar = useCallback(async (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const file = event.currentTarget.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const {data} = await axios.patch('/api/v1/users/profiles/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAvatar(data.avatar);
      toast({
        title: 'Imagem atualizada 🎉',
        status: 'success',
        variant: 'subtle',
        description: 'Pode levar alguns minutos para atualizar a imagem.'
      });
    } catch (err) {
      console.log(err);
      toast({
        title: 'Erro ao atualizar imagem',
        status: 'error',
        variant: 'subtle',
        description: err.response.data.message
      });
    }
    setIsLoading(false);
  }, [token, toast]);

  return (
    <Flex position="relative" mx="auto">
      <input
        onChange={handleUpdateAvatar}
        type="file"
        accept="image/*"
        style={{
          position: "absolute",
          width:"100%",
          height:"100%",
          zIndex:"1000",
          cursor:"pointer",
          opacity: "0",
        }}
      />
      <Avatar
        size="xl"
        name={user.name}
        src={avatar}
        bg="#000"
        border="2px solid #6272a4"
        mb="2"
      />
    </Flex>
  )
}
