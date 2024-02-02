import { Box } from '@chakra-ui/react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useCallback, useEffect } from 'react';
import { useAuth } from '../../../states/hooks/use-auth';
import useSessionStorage from '../../../states/hooks/use-session-storage';

export function LoginButtonGreat({ onSuccess }) {
  const { validateToken, data, logout } = useAuth();
  const token = useSessionStorage('token', data);

  useEffect(() => {
    setTimeout(() => {
      if (!token) logout();
    }, 1000)
  }, [token, logout]);

  const login = useCallback(async (event: CredentialResponse) => {
    const user = await validateToken(event.credential);
    onSuccess(user)
  }, [validateToken, onSuccess]);

  return (
    <Box>
      <GoogleLogin
        onSuccess={login}
        shape="circle"
        size='large'
        theme='filled_black'
        text='signin'
      />
    </Box>
  );
}
