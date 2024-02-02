import { ChakraProvider} from "@chakra-ui/react"
import { theme } from "../styles/theme"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CustomSessionProvider } from "../states/contexts/custom-session-context";
import { googleAuthConfigs } from "../configs/google-auth";
import { QueryClient, QueryClientProvider } from "react-query";
import './styles.scss';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleAuthConfigs.clientID}>
        <ChakraProvider theme={theme}>
          <CustomSessionProvider>
            <Component {...pageProps} />
          </CustomSessionProvider>
        </ChakraProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
