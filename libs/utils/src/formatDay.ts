import dayjs from "dayjs";
export function formatDay(value: string | number = 0, locale: string) {
  if (locale === "en") {
    return dayjs(value).format("MM/DD");
  }
  if (locale === "vi") {
    return dayjs(value).format("DD/MM");
  }
}
