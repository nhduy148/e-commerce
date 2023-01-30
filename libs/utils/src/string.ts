export function stripText(text: string, length: number) {
  if (!text || text.length <= length) {
    return text;
  }
  return (
    text
      .split("")
      .filter((_, index) => {
        return index < length;
      })
      .join("") + "..."
  );
}
