import React from "react";

import { Typography } from "@mui/material";

import { LcStaticLayout } from "@lc/components";

const LcAboutUs: React.FunctionComponent = () => {
  return (
    <LcStaticLayout
      breadcrumb={{ name: "Về chúng tôi", url: "/about" }}
      pageName="LG Cosmetics là gì?"
    >
      <Typography variant="body1" gutterBottom>
        Công ty TNHH Mỹ Phẩm LG VINA là Công ty TNHH 2 thành viên gồm Công ty LG
        Household & Health Care tại Hàn Quốc (LG H&H) và Tổng công ty công
        nghiệp dầu thực vật Việt Nam (Vocarimex).
      </Typography>

      <Typography variant="body1" gutterBottom>
        Được thành lập từ năm 1997, Công ty TNHH Mỹ phẩm LG VINA tự hào mang đến
        cho khách hàng Việt Nam những thương hiệu mỹ phẩm uy tín và các thương
        hiệu chăm sóc nhà cửa, chăm sóc cá nhân cao cấp.
      </Typography>

      <Typography variant="body1" gutterBottom>
        Chúng tôi hiện đang kinh doanh hai ngành hàng chính: Beauty và HDB (Home
        Care and Daily Beauty). Beauty bao gồm các sản phẩm thuộc nhóm chăm sóc
        da, trang điểm và thực phẩm chức năng và HDB bao gồm các sản phẩm thuộc
        nhóm chăm sóc nhà cửa, chăm sóc cá nhân hằng ngày.
      </Typography>

      <Typography gutterBottom variant="body1">
        Với định hướng trở thành công ty hàng đầu trong lĩnh vực làm đẹp và sức
        khỏe, chúng tôi luôn cẩn trọng trong khâu nghiên cứu và sản xuất, nghiêm
        ngặt trong từng quy trình quản lý để đảm bảo các sản phẩm của công ty
        luôn đạt chất lượng cao nhất khi đến với khách hàng, luôn đột phá và đáp
        ứng nhu cầu ngày càng cao của người tiêu dùng.
      </Typography>
      <Typography gutterBottom variant="body1">
        Tìm hiểu thêm:
      </Typography>
      <ul style={{ textAlign: "left" }}>
        <li>
          <Typography gutterBottom variant="body1">
            <a href="https://lgvina.vn/page/ve-chung-toi">Lịch sử phát triển</a>
          </Typography>
        </li>
        <li>
          <Typography gutterBottom variant="body1">
            <a href="https://lgvina.vn/page/ve-chung-toi">
              Phương hướng kinh doanh
            </a>
          </Typography>
        </li>
        <li>
          <Typography gutterBottom variant="body1">
            <a href="https://lgvina.vn/page/ve-chung-toi">
              Lĩnh vực kinh doanh
            </a>
          </Typography>
        </li>
      </ul>
    </LcStaticLayout>
  );
};

export default LcAboutUs;
