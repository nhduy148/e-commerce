import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

interface IDataProviderProps {}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
    },
  },
});

export const DataProvider: React.FunctionComponent<IDataProviderProps> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <ReactQueryDevtools
        panelProps={{
          className: "queryDevTools",
        }}
      />
      {children}
    </QueryClientProvider>
  );
};

export default DataProvider;
