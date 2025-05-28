import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { Router } from "./Router";

const queryClient = new QueryClient();

export function App() {
  return (
    <main className="h-dvh flex flex-col items-center justify-center">
      <QueryClientProvider client={queryClient}>
        <Router />
        <ToastContainer />
      </QueryClientProvider>
    </main>
  );
}
