import { Box } from '@chakra-ui/react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useCallback, useEffect } from 'react';
import { useAuth } from '../../../states/hooks/use-auth';
import useSessionStorage from '../../../states/hooks/use-session-storage';

export function Login() {
  const { validateToken, data, logout } = useAuth();
  const token = useSessionStorage('token', data);

  useEffect(() => {
    setTimeout(() => {
      if (!token) logout();
    }, 1000)
  }, [token, logout]);

  const login = useCallback(async (event: CredentialResponse) => {
    await validateToken(event.credential);
  }, [validateToken]);

  return (
    <Box
      position="absolute"
      top="6"
      right="6"
    >
      {!data && (
        <GoogleLogin
          onSuccess={login}
          shape="circle"
          size='medium'
          theme='filled_black'
          text='signin'
        />
      )}
    </Box>
  );
}
