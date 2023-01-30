import { StaticImageData } from "next/image";

export function validImageUrl(url: string | StaticImageData) {
  if (typeof url === "string") {
    const [validUrl, ...params] = url.split("?");
    return /(http(s?):)*.(?:jpg|gif|png|webp|jpeg)/g.test(validUrl);
  }
  if (typeof url === "object") {
    return true;
  }
  return false;
}
