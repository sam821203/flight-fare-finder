import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Outlet, RouterProvider, ScrollRestoration, createBrowserRouter } from "react-router";

import { RequireAuth } from "@/components/RequireAuth";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { ErrorPage } from "@/pages/ErrorPage";
import { Landing } from "@/pages/Landing";
import { NotFound } from "@/pages/NotFound";

const queryClient = new QueryClient();

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/sign-in", element: <Auth mode="signin" /> },
      { path: "/sign-up", element: <Auth mode="signup" /> },
      { path: "/auth", element: <Navigate to="/sign-in" replace /> },
      {
        element: <RequireAuth />,
        children: [{ path: "/app", element: <Dashboard /> }],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
