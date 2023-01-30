import { GSPHead, GSPStaticLayout } from "@gsp/components";
import { NextPage } from "next";

const GSPAboutUs: NextPage = () => {
  return (
    <>
      <GSPHead title="QTMP" titleTemplate="Về chúng tôi | %s" />
      <GSPStaticLayout slug="about-us" />
    </>
  );
};

export default GSPAboutUs;
