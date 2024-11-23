import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import RoomManagement from './pages/RoomManagement';
import GuestManagement from './pages/GuestManagement';
import BookingManagement from './pages/BookingManagement';
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
             element: <RoomManagement />,
          },
          {
            path: 'guests',
             element: <GuestManagement /> 

          },
          {
            path: 'booking',
             element: <BookingManagement /> 

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