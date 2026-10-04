import {
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

import PublicLayout from '../components/layout/PublicLayout.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import FarmerLayout from '../components/layout/FarmerLayout.jsx';

import Home from '../pages/public/Home.jsx';
import Products from '../pages/public/Products.jsx';
import ProductDetails from '../pages/public/ProductDetails.jsx';
import About from '../pages/public/About.jsx';
import FarmerPublicProfile from '../pages/public/FarmerPublicProfile.jsx';
import NotFound from '../pages/public/NotFound.jsx';

import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

import AdminLogin from '../pages/admin/AdminLogin.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import ManageFarmers from '../pages/admin/ManageFarmers.jsx';
import ManagePayments from '../pages/admin/ManagePayments.jsx';
import ManageProducts from '../pages/admin/ManageProducts.jsx';
import ManageUsers from '../pages/admin/ManageUsers.jsx';
import ReviewsDashboard from '../pages/admin/ReviewsDashboard.jsx';
import FarmerDetails from '../pages/admin/FarmerDetails.jsx';
import PaymentDetails from '../pages/admin/PaymentDetails.jsx';

import FarmerDashboard from '../pages/farmer/FarmerDashboard.jsx';
import FarmerProfile from '../pages/farmer/FarmerProfile.jsx';
import AddProduct from '../pages/farmer/AddProduct.jsx';
import EditProduct from '../pages/farmer/EditProduct.jsx';
import MyProducts from '../pages/farmer/MyProducts.jsx';
import MyReviews from '../pages/farmer/MyReviews.jsx';
import Payments from '../pages/farmer/Payments.jsx';
import PaymentProofForm from '../pages/farmer/PaymentProofForm.jsx';
import ReceivedOrders from '../pages/farmer/ReceivedOrders.jsx';

const AdminOnly = ({ children }) => {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['admin']}>
        {children}
      </RoleRoute>
    </ProtectedRoute>
  );
};

const FarmerOnly = ({ children }) => {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['farmer']}>
        {children}
      </RoleRoute>
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/farmers/:id"
          element={<FarmerPublicProfile />}
        />

        <Route
          path="/about"
          element={<About />}
        />
      </Route>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={
          <AdminOnly>
            <AdminLayout />
          </AdminOnly>
        }
      >
        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="farmers"
          element={<ManageFarmers />}
        />

        <Route
          path="farmers/:id"
          element={<FarmerDetails />}
        />

        <Route
          path="payments"
          element={<ManagePayments />}
        />

        <Route
          path="payments/:id"
          element={<PaymentDetails />}
        />

        <Route
          path="products"
          element={<ManageProducts />}
        />

        <Route
          path="users"
          element={<ManageUsers />}
        />

        <Route
          path="reviews"
          element={<ReviewsDashboard />}
        />
      </Route>

      <Route
        path="/farmer"
        element={
          <FarmerOnly>
            <FarmerLayout />
          </FarmerOnly>
        }
      >
        <Route
          index
          element={
            <Navigate
              to="/farmer/dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={<FarmerDashboard />}
        />

        <Route
          path="profile"
          element={<FarmerProfile />}
        />

        <Route
          path="products"
          element={<MyProducts />}
        />

        <Route
          path="products/add"
          element={<AddProduct />}
        />

        <Route
          path="products/:id/edit"
          element={<EditProduct />}
        />

        <Route
          path="reviews"
          element={<MyReviews />}
        />

        <Route
          path="payments"
          element={<Payments />}
        />

        <Route
          path="payments/proof"
          element={<PaymentProofForm />}
        />

        <Route
          path="orders"
          element={<ReceivedOrders />}
        />
      </Route>

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
};

export default AppRoutes;