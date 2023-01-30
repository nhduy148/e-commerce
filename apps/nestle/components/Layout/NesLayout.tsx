import {
  ICategory,
  ICommonPageData,
  useCommonPageDataQuery,
  useListBrands,
  useListCategories,
} from "@hera/data";
import { ScrollToTopButton } from "@hera/ui";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { NesHomeServices } from "@nestle/HomeComponents";
import { useBreakPoint } from "@nestle/hooks";
import { FC, memo, useEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { NesAuthenModal } from "../NesAuthenModal";
import { NesFooter } from "./NesFooter";
import { NesHeader } from "./NesHeader";

export interface INesLayoutProps {
  children?: React.ReactElement;
}

const NesLayoutComponent: FC<INesLayoutProps> = ({ children }) => {
  const isPC = useBreakPoint("sm");
  const { palette, zIndex } = useTheme();
  const ref = useRef<HTMLDivElement>();
  const [headerHeight, setHeaderHeight] = useState<number>(
    ref?.current?.clientHeight || 0,
  );
  const onChangeHeaderHeight = () => {
    if (ref.current?.clientHeight !== headerHeight) {
      setHeaderHeight(ref.current?.clientHeight || 155);
    }
  };

  const {
    data: commonPageData,
    isLoading: isPageLoading,
  }: { data: ICommonPageData; isLoading: boolean } = useCommonPageDataQuery();
  const { data: listBrands } = useListBrands();
  const { data: categoryResponse } = useListCategories();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  let splashSession: boolean | string = true;

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("resize", () => onChangeHeaderHeight());
    return () => {
      window.removeEventListener("resize", () => onChangeHeaderHeight());
    };
  }, []);

  useEffect(() => {
    if (!isPageLoading) {
      onChangeHeaderHeight();
    }
  }, [isPageLoading]);

  const listCategories: ICategory[] =
    categoryResponse?.categories?.root?.taxons || [];

  useEffect(() => {
    splashSession = JSON.parse(sessionStorage.getItem("splash-session"));
    if (splashSession == null) {
      splashSession = true;
    }
    if (!Boolean(splashSession)) {
      splashSession = false;
    }
    sessionStorage.setItem("splash-session", String(splashSession));
    //@ts-ignore
    setIsOpen(splashSession);
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem("splash-session", String(false));
    setIsOpen(false);
  };
  return (
    <Box
      style={{
        backgroundColor: palette.custom.primaryBackground,
        position: "relative",
      }}
    >
      <NesAuthenModal isOpen={isOpen}>
        <Box
          p={isPC ? 4 : 3}
          sx={{
            "@media (orientation: landscape)": {
              width: "500px",
            },
          }}
        >
          <Box
            sx={{
              width: {
                sm: "800px",
                xs: "100%",
                "@media (orientation: landscape)": {
                  width: "100%",
                },
              },
              overflow: "auto",
            }}
            maxHeight="450px"
          >
            <Box>
              <Typography>
                Nestlé tin rằng nuôi con bằng sữa mẹ là khởi đầu dinh dưỡng lý
                tưởng cho trẻ sơ sinh và chúng tôi hoàn toàn ủng hộ khuyến nghị
                của Tổ chức Y tế Thế giới về việc cho trẻ bú mẹ hoàn toàn trong
                sáu tháng đầu đời, sau đó là cho trẻ ăn thức ăn bổ sung dinh
                dưỡng đầy đủ cùng với việc tiếp tục cho trẻ bú mẹ đến hai tuổi
                hoặc lâu hơn.
              </Typography>
              <br></br>
              <Typography>
                Chúng tôi cũng nhận thấy rằng việc nuôi con bằng sữa mẹ không
                phải lúc nào cũng là một lựa chọn khả thi cho các bậc cha mẹ.
                Chúng tôi khuyến nghị các chuyên gia y tế tư vấn cho cha mẹ về
                những lợi ích của việc nuôi con bằng sữa mẹ. Nếu cha mẹ cân nhắc
                không cho con bú, các chuyên gia y tế cần tư vấn cho cha mẹ rằng
                quyết định như vậy có thể khó đảo ngược và sẽ có những ảnh hưởng
                về mặt xã hội và tài chính. Việc cho trẻ bú bình một phần sẽ làm
                giảm nguồn cung cấp sữa mẹ.
              </Typography>
              <br></br>
              <Typography>
                Vì trẻ tăng trưởng với tốc độ khác nhau, các chuyên gia y tế nên
                tư vấn về thời điểm thích hợp để trẻ bắt đầu ăn thức ăn bổ sung.
                Sữa công thức dành cho trẻ sơ sinh và thức ăn bổ sung phải luôn
                được pha chế, sử dụng và bảo quản theo hướng dẫn trên nhãn để
                tránh rủi ro cho sức khỏe của trẻ.
              </Typography>
            </Box>
          </Box>

          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" onClick={handleAccept}>
              <Typography px={4}>Chấp Nhận</Typography>
            </Button>
          </Box>
        </Box>
      </NesAuthenModal>
      <NesHeader
        menu={commonPageData?.categoryConfig}
        topBrands={commonPageData?.topBrandBanners || []}
        listBrands={listBrands || []}
        listCategories={listCategories || []}
        ref={ref}
        isLoading={isPageLoading}
      />

      <Box style={{ paddingTop: headerHeight }}>{children}</Box>
      <NesHomeServices />
      <NesFooter />
      <ScrollToTopButton />
    </Box>
  );
};

export const NesLayout = memo(NesLayoutComponent, isEqual);
