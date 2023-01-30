export const flattenMessages = (jsonMessage: any, prefix = "") => {
  if (jsonMessage === null) {
    return {};
  }
  return Object.keys(jsonMessage).reduce((messages, key) => {
    const value = jsonMessage[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      Object.assign(messages, { [prefixedKey]: value });
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
};
