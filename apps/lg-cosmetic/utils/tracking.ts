export const devLog = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(message, optionalParams);
  }
};
