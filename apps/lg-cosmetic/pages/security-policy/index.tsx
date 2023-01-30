import React from "react";

import { LcStaticLayout } from "@lc/components";
import { Typography } from "@mui/material";

const LcAboutUs: React.FunctionComponent = () => {
  return (
    <LcStaticLayout
      breadcrumb={{ name: "Chính sách bảo mật", url: "/security-policy" }}
      pageName="Chính sách bảo mật"
    >
      <ol style={{ listStyleType: "upper-roman" }}>
        <li>
          <Typography variant="h6" gutterBottom>
            MỤC ĐÍCH VÀ PHẠM VI THU THẬP
          </Typography>
          <Typography variant="body1" gutterBottom>
            Việc thu thập dữ liệu chủ yếu trên website bao gồm: họ tên, email,
            số điện thoại trong mục liên hệ và cơ hội nghề nghiệp. Đây là các
            thông tin mà chúng tôi cần được cung cấp nhằm gửi các thông tin phản
            hồi, giải đáp thắc mắc, thông tin tuyển dụng hiện tại và trong tương
            lai cho các khách hàng và ứng viên khi được yêu cầu. Người truy cập
            website này (sau đây gọi là “Người truy cập”) sẽ tự chịu trách nhiệm
            về bảo mật, lưu giữ mọi hoạt động sử dụng dịch vụ dưới thông tin mà
            mình cung cấp và hộp thư điện tử của mình. Ngoài ra, Người truy cập
            có trách nhiệm thông báo kịp thời cho chúng tôi qua mục Liên Hệ trên
            website này hoặc email{" "}
            <a href="mailto:lgvinacareer@lghnh.com.vn">
              lgvinacareer@lghnh.com.vn
            </a>{" "}
            về những hành vi sử dụng trái phép, lạm dụng, vi phạm bảo mật thông
            tin của bên thứ ba để có biện pháp giải quyết phù hợp.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Người truy cập website này (sau đây gọi là “Người truy cập”) sẽ tự
            chịu trách nhiệm về bảo mật, lưu giữ mọi hoạt động sử dụng dịch vụ
            dưới thông tin mà mình cung cấp và hộp thư điện tử của mình. Ngoài
            ra, Người truy cập có trách nhiệm thông báo kịp thời cho chúng tôi
            qua mục Liên Hệ trên website này hoặc email
            lgvinacareer@lghnh.com.vn về những hành vi sử dụng trái phép, lạm
            dụng, vi phạm bảo mật thông tin của bên thứ ba để có biện pháp giải
            quyết phù hợp.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" gutterBottom>
            PHẠM VI SỬ DỤNG THÔNG TIN
          </Typography>
          <Typography variant="body1" gutterBottom>
            Chúng tôi sử dụng thông tin Người truy cập cung cấp để:
          </Typography>

          <Typography variant="body1" gutterBottom>
            - Gửi các thông tin về tuyển dụng của công ty cho các cá nhân đã
            đăng kí tại mục Cơ hội nghề nghiệp trên website này
          </Typography>

          <Typography variant="body1" gutterBottom>
            - Phản hồi các thắc mắc về tuyển dụng khi được yêu cầu
          </Typography>

          <Typography variant="body1" gutterBottom>
            - Liên lạc và giải quyết các thắc mắc tại mục Liên hệ khi được yêu
            cầu
          </Typography>

          <Typography variant="body1" gutterBottom>
            - Không sử dụng thông tin cá nhân của Người truy cập ngoài mục đích
            được yêu cầu
          </Typography>

          <Typography variant="body1" gutterBottom>
            - Khi có yêu cầu của cơ quan tư pháp bao gồm: Viện kiểm sát, tòa án,
            cơ quan công an điều tra liên quan đến hành vi vi phạm pháp luật nào
            đó của Người truy cập.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" gutterBottom>
            THỜI GIAN LƯU TRỮ THÔNG TIN
          </Typography>

          <Typography variant="body1" gutterBottom>
            Dữ liệu cá nhân của Người truy cập sẽ được lưu trữ cho đến khi có
            yêu cầu Ban quản trị hủy bỏ. Còn lại trong mọi trường hợp thông tin
            cá nhân Người truy cập sẽ được bảo mật trên máy chủ của chúng tôi.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" gutterBottom>
            NHỮNG NGƯỜI HOẶC TỔ CHỨC CÓ THỂ ĐƯỢC TIẾP CẬN VỚI THÔNG TIN CÁ NHÂN
          </Typography>

          <Typography variant="body1" gutterBottom>
            Đối tượng được tiếp cận với thông tin cá nhân của Người truy cập
            thuộc một trong những trường hợp sau:
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Nhân viên của công ty.
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Ban lãnh đạo của công ty.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" gutterBottom>
            ĐỊA CHỈ CỦA ĐƠN VỊ THU THẬP VÀ QUẢN LÝ THÔNG TIN CÁ NHÂN
          </Typography>

          <Typography variant="body1" gutterBottom>
            CHI NHÁNH CÔNG TY TNHH MỸ PHẨM LG VINA
          </Typography>
          <Typography variant="body1" gutterBottom>
            Địa chỉ: 138-142 Hai Bà Trưng, Phường Đa Kao, Quận 1, Thành phố Hồ
            Chí Minh.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" gutterBottom>
            PHƯƠNG TIỆN VÀ CÔNG CỤ ĐỂ NGƯỜI TRUY CẬP TIẾP CẬN VÀ CHỈNH SỬA DỮ
            LIỆU CÁ NHÂN CỦA MÌNH
          </Typography>

          <Typography variant="body1" gutterBottom>
            Người truy cập có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy
            bỏ thông tin cá nhân của mình bằng cách liên hệ với Công ty qua mục
            Liên hệ trên website này.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Người truy cập có quyền gửi khiếu nại về nội dung bảo mật thông tin
            cho Công ty. Khi tiếp nhận những phản hồi này, chúng tôi sẽ xác nhận
            lại thông tin, trường hợp đúng như phản ánh của Người truy cập tùy
            theo mức độ, chúng tôi sẽ có những biện pháp xử lý kịp thời.
          </Typography>
        </li>
        <li>
          <Typography variant="h6" gutterBottom>
            CƠ CHẾ TIẾP NHẬN VÀ GIẢI QUYẾT KHIẾU NẠI CỦA NGƯỜI TRUY CẬP
          </Typography>

          <Typography variant="body1" gutterBottom>
            Mọi tranh chấp phát sinh giữa Công ty và Người truy cập sẽ được giải
            quyết trên cơ sở thương lượng. Trường hợp không đạt được thỏa thuận
            như mong muốn, một trong hai bên có quyền đưa vụ việc ra Tòa án nhân
            dân có thẩm quyền để giải quyết.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Khi không giải quyết được qua thương lượng, hòa giải như trên, bên
            bị vi phạm tập hợp các chứng cứ như email, tin nhắn... và liên lạc
            với Công ty. Công ty sẽ liên lạc lại với người khiếu nại để giải
            quyết.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Nếu vụ việc vượt quá thẩm quyền của mình, Công ty sẽ đề nghị chuyển
            vụ việc cho các cơ quan chức năng có thẩm quyền. Trong trường hợp
            này, Công ty vẫn phối hợp hỗ trợ để bảo vệ tốt nhất bên bị vi phạm.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Thông tin cá nhân của Người truy cập được cam kết bảo mật tuyệt đối
            theo chính sách bảo vệ thông tin cá nhân. Việc thu thập và sử dụng
            thông tin của mỗi Người truy cập chỉ được thực hiện khi có sự yêu
            cầu hoặc đồng ý của Người truy cập đó, trừ những trường hợp pháp
            luật có quy định khác.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Không sử dụng, không chuyển giao, cung cấp hay tiết lộ cho bên thứ 3
            nào về thông tin cá nhân của Người truy cập khi không có sự đồng ý
            từ Người truy cập.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn
            đến mất mát dữ liệu cá nhân Người truy cập, chúng tôi sẽ có trách
            nhiệm thông báo vụ việc cho cơ quan chức năng điều tra xử lý kịp
            thời.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Ban quản trị yêu cầu các cá nhân khi đăng ký phải cung cấp đầy đủ
            thông tin cá nhân có liên quan như: Họ và tên, email, điện
            thoại,...., và chịu trách nhiệm về tính pháp lý của những thông tin
            trên. Ban quản trị không chịu trách nhiệm cũng như không giải quyết
            mọi khiếu nại có liên quan đến quyền lợi của Người truy cập đó nếu
            xét thấy tất cả thông tin cá nhân của Người truy cập đó cung cấp khi
            đăng ký ban đầu là không chính xác.
          </Typography>
        </li>
      </ol>
    </LcStaticLayout>
  );
};

export default LcAboutUs;
