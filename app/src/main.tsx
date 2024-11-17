import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./routes/error";
import InvoicesPage from "./routes/invoices";
import LoginPage from './routes/login.tsx';
import HomePage from './routes/home.tsx';
import {store} from "./store/store.ts"
import {Provider} from "react-redux"
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children:[
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/invoices",
        element: <InvoicesPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ]
  },
  
]);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </Provider>
  </QueryClientProvider>
);