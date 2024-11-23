import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import RoomManagement from './pages/RoomManagement';
import GuestManagement from './pages/GuestManagement';
import Billing from './pages/Billing';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: 'rooms',
            children: [
              { index: true, element: <RoomManagement /> },
              { path: ':id', element: <RoomManagement /> },
              { path: 'create', element: <RoomManagement /> }
            ]
          },
          {
            path: 'guests',
            children: [
              { index: true, element: <GuestManagement /> },
              { path: ':id', element: <GuestManagement /> },
              { path: 'create', element: <GuestManagement /> }
            ]
          },
          {
            path: 'billing',
            element: <Billing />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;