type EventType = "select-item";
interface IGTAGOptions {
  event_categories: "Ngành hàng";
  event_label: string;
}

export const gtagEvent = (type: EventType, options: IGTAGOptions) => {
  // @ts-ignore
  if (!window?.gtag) {
    return;
  }
  if (type === "select-item") {
    // @ts-ignore
    window?.gtag("event", options);
  }
};
