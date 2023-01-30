import { useBreakPoint } from "@gsp/hooks";
import { useFormatter } from "@hera/i18n";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

type Props = {};

const Custom404 = (props: Props) => {
  const router = useRouter();
  const isPC = useBreakPoint("sm");
  const { __ } = useFormatter();

  return (
    <Container>
      <Box minHeight={isPC ? "50vh" : "40vh"} display="flex">
        <Box m="auto" py={5}>
          <Typography variant="h1" textAlign="center">
            404
          </Typography>

          <Typography variant="h4" textAlign="center">
            {__({
              defaultMessage: "Không tìm thấy nội dung đang tìm kiếm!",
            })}
          </Typography>
          <Typography variant="subtitle1" textAlign="center">
            {__({
              defaultMessage:
                "Xin lỗi, nội dung bạn đang tìm kiếm hiện không tồn tại. Vui lòng truy cập trang chủ để tìm kiếm nhiều nội dung hơn.",
            })}
          </Typography>
          <Box display="flex" mt={1}>
            <Button
              size="small"
              variant="contained"
              sx={{ margin: "auto" }}
              onClick={(e) => {
                router.push("/");
              }}
            >
              {__({ defaultMessage: "Quay về Trang Chủ" })}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Custom404;
