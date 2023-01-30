import { AuthenticationContext } from "@hera/contexts";
import { Box, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import {
  FC,
  Fragment,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface IProps {
  children: ReactNode | JSX.Element;
  isLoading: boolean;
  loadingComponent: ReactNode | JSX.Element;
}

export const CSRPrivateRoute: FC<IProps> = ({
  children,
  isLoading,
  loadingComponent,
}) => {
  const { isLogin } = useContext(AuthenticationContext);
  const [progress, setProgress] = useState(0);
  const { push } = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 30);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !isLogin) {
      push("/");
    }
  }, [isLogin, isLoading]);

  if (isLoading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: "white",
          visibility: "visible",
          opacity: 1,
          zIndex: 9999,
        }}
      >
        <Box
          width={1}
          sx={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box width={1} height={1}>
          {loadingComponent}
        </Box>
      </Box>
    );
  }
  return <Fragment>{children}</Fragment>;
};
