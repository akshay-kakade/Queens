import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminAnalytics from './pages/Admin/AdminAnalytics';
import AdminEvents from './pages/Admin/AdminEvents';
import AdminTenants from './pages/Admin/AdminTenants';
import TenantDashboard from './pages/Tenant/TenantDashboard';
import TenantProfile from './pages/Tenant/TenantProfile';
import Inventory from './pages/Tenant/Inventory';
import TenantOrders from './pages/Tenant/TenantOrders';
import CustomerHome from './pages/Customer/CustomerHome';
import ShopExplorer from './pages/Customer/ShopExplorer';
import ShopDetails from './pages/Customer/ShopDetails';
import CustomerProfile from './pages/Customer/CustomerProfile';
import CartPage from './pages/Customer/CartPage';
import OrderSuccess from './pages/Customer/OrderSuccess';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />, 
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/analytics',
    element: <AdminAnalytics />,
  },
  {
    path: '/admin/events',
    element: <AdminEvents />,
  },
  {
    path: '/admin/tenants',
    element: <AdminTenants />,
  },
  {
    path: '/tenant',
    element: <TenantDashboard />,
  },
  {
    path: '/tenant/inventory',
    element: <Inventory />,
  },
  {
    path: '/tenant/orders',
    element: <TenantOrders />,
  },
  {
    path: '/tenant/profile',
    element: <TenantProfile />,
  },
  {
    path: '/customer',
    element: <CustomerHome />,
  },
  {
    path: '/customer/explore',
    element: <ShopExplorer />,
  },
  {
    path: '/customer/shop/:shopId',
    element: <ShopDetails />,
  },
  {
    path: '/customer/cart',
    element: <CartPage />,
  },
  {
    path: '/customer/order-success',
    element: <OrderSuccess />,
  },
  {
    path: '/customer/profile',
    element: <CustomerProfile />,
  },
]);
