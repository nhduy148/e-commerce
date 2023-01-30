import dayjs from "dayjs";
export function formatDayTime(value: string | number = 0, locale: string) {
  if (locale === "en") {
    return dayjs(value).format("MM/DD/YYYY h:mm A");
  }
  if (locale === "vi") {
    return dayjs(value).format("DD/MM/YYYY h:mm A");
  }
}
