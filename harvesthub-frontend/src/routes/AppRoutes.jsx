import {
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import PublicLayout from '../components/layout/PublicLayout.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import FarmerLayout from '../components/layout/FarmerLayout.jsx';

import Home from '../pages/public/Home.jsx';
import Products from '../pages/public/Products.jsx';
import ProductDetails from '../pages/public/ProductDetails.jsx';
import FarmerPublicProfile from '../pages/public/FarmerPublicProfile.jsx';
import About from '../pages/public/About.jsx';
import NotFound from '../pages/public/NotFound.jsx';

import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

import AdminLogin from '../pages/admin/AdminLogin.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import ManageFarmers from '../pages/admin/ManageFarmers.jsx';
import ManageProducts from '../pages/admin/ManageProducts.jsx';
import ManagePayments from '../pages/admin/ManagePayments.jsx';
import ManageUsers from '../pages/admin/ManageUsers.jsx';
import ReviewsDashboard from '../pages/admin/ReviewsDashboard.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

import FarmerDashboard from '../pages/farmer/FarmerDashboard.jsx';
import FarmerProfile from '../pages/farmer/FarmerProfile.jsx';
import MyProducts from '../pages/farmer/MyProducts.jsx';
import AddProduct from '../pages/farmer/AddProduct.jsx';
import EditProduct from '../pages/farmer/EditProduct.jsx';
import ReceivedOrders from '../pages/farmer/ReceivedOrders.jsx';
import MyReviews from '../pages/farmer/MyReviews.jsx';
import Payments from '../pages/farmer/Payments.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/farmers/:id"
          element={<FarmerPublicProfile />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route
              index
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/farmers"
              element={<ManageFarmers />}
            />

            <Route
              path="/admin/products"
              element={<ManageProducts />}
            />

            <Route
              path="/admin/payments"
              element={<ManagePayments />}
            />

            <Route
              path="/admin/users"
              element={<ManageUsers />}
            />

            <Route
              path="/admin/reviews"
              element={<ReviewsDashboard />}
            />
          </Route>
        </Route>
      </Route>

      {/* Farmer routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['farmer']} />}>
          <Route element={<FarmerLayout />}>
            <Route
              path="/farmer/dashboard"
              element={<FarmerDashboard />}
            />

            <Route
              path="/farmer/profile"
              element={<FarmerProfile />}
            />

            <Route
              path="/farmer/products"
              element={<MyProducts />}
            />

            <Route
              path="/farmer/products/add"
              element={<AddProduct />}
            />

            <Route
              path="/farmer/products/:id/edit"
              element={<EditProduct />}
            />

            <Route
              path="/farmer/inquiries"
              element={<ReceivedOrders />}
            />

            <Route
              path="/farmer/reviews"
              element={<MyReviews />}
            />

            <Route
              path="/farmer/payments"
              element={<Payments />}
            />
          </Route>
        </Route>
      </Route>

      {/* Application 404 */}
      <Route
        path="/not-found"
        element={<NotFound />}
      />

      {/* Catch-all */}
      <Route
        path="*"
        element={<Navigate to="/not-found" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;