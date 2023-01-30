import React from "react";

import { LcStaticLayout } from "@lc/components";
import { Typography } from "@mui/material";

const LcDeliveryAndPayment: React.FunctionComponent = () => {
  return (
    <LcStaticLayout
      breadcrumb={{ name: "Thanh toán và đổi trả", url: "/return-policy" }}
      pageName="Thanh toán và đổi trả"
    >
      <ol type="I">
        <li>
          <Typography variant="h6" gutterBottom>
            CHÍNH SÁCH THANH TOÁN
          </Typography>
          <Typography variant="body1" gutterBottom>
            Quý khách hàng có thể chọn các hình thức thanh toán bên dưới tùy
            theo nhu cầu:
          </Typography>

          <ul>
            <li>
              <Typography variant="body1" gutterBottom>
                Thanh toán bằng tiền mặt (COD) khi nhận hàng, áp dụng tại tất cả
                các tỉnh thành.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" gutterBottom>
                Thanh toán trước bằng các hình thức:
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1" gutterBottom>
                    Thẻ ATM Nội Địa
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" gutterBottom>
                    Thẻ tín dụng / Thẻ ghi nợ / VISA / MASTER / JCB
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" gutterBottom>
                    Ví điện tử MOMO
                  </Typography>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <Typography variant="h6" gutterBottom>
            CHÍNH SÁCH GIAO HÀNG
          </Typography>

          <Typography variant="body1" gutterBottom>
            LG VINA giao hàng hóa đến tận nơi Quý khách hàng yêu cầu trên toàn
            quốc. Thời gian giao hàng tối đa trong 14 ngày. Thời gian được tính
            từ lúc bạn đặt đơn hàng đến khi nhận được hàng, không kể ngày lễ hay
            thứ 7 và chủ nhật. Trong thời gian diễn ra sự kiện lớn với số lượng
            đơn hàng tăng mạnh, thời gian giao hàng có thể kéo dài tùy theo tình
            hình thực tế, kính mong Quý khách thông cảm.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" gutterBottom>
            CHÍNH SÁCH ĐỔI TRẢ
          </Typography>
          <Typography variant="body1" gutterBottom>
            Khi mua hàng tại Website chính hãng LG VINA VIETNAM, khách hàng được
            kiểm tra đơn hàng và trả toàn bộ đơn hàng lại cho nhà vận chuyển
            ngay tại thời điểm nhận hàng khi gặp trường hợp:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1" gutterBottom>
                Thùng hàng không được nguyên vẹn.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" gutterBottom>
                Sản phẩm bị lỗi, rách bao bì, vỡ hỏng trong quá trình vận
                chuyển.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" gutterBottom>
                Sản phẩm bị giao sai loại, sai kích cỡ, sai màu sắc, thiếu quà
                tặng đi kèm so với đơn đặt.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" gutterBottom>
                Sản phẩm bị hết hạn sử dụng
              </Typography>
            </li>
          </ul>
          <Typography variant="body1" gutterBottom>
            Trường hợp khách đã nhận kiện hàng: khách hàng vui lòng cung cấp
            video đủ 6 mặt của thùng hàng và quá trình khui hàng để CSKH xác
            minh và hỗ trợ đổi trả.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Các trường hợp khác, LG VINA KHÔNG ÁP DỤNG CHÍNH SÁCH ĐỔI TRẢ HÀNG.
          </Typography>
          <Typography variant="body1" gutterBottom>
            * Trường hợp đơn đổi trả đã được thanh toán online: bạn vui lòng
            liên hệ với CSKH để được hướng dẫn xử lý hoàn tiền hoặc đặt lại đơn
            hàng mới qua:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1" gutterBottom>
                Hotline: 02873056686
              </Typography>
              <Typography variant="body1" gutterBottom>
                (Sáng: 9h-12h | Chiều: 13h-18h trừ Thứ 7 & Chủ nhật)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" gutterBottom>
                Email: cs-team@onpoint.vn
              </Typography>
            </li>
          </ul>
          <Typography variant="body1" gutterBottom sx={{ fontStyle: "italic" }}>
            Mọi phản hồi về hàng hóa khác với các lý do bên trên, vui lòng liên
            hệ CSKH qua địa chỉ email cs-team@onpoint.vn để được tư vấn thêm
          </Typography>
        </li>
      </ol>
    </LcStaticLayout>
  );
};

export default LcDeliveryAndPayment;
