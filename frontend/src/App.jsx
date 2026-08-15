import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./shared/ProtectedRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashBoardPage from "./admin/AdminDashBoardPage";
import AdminBooksPage from "./admin/AdminBooksPage";
import AdminUserPage from "./admin/AdminUserPage";
import AdminFinePage from "./admin/AdminFinePage";
import UserLayout from "./user/UserLayout";
import UserDashBoardPage from "./user/UserDashBoardPage";
import UserBooksPage from "./user/UserBooksPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes only for Admin */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashBoardPage />} />
          <Route path="books" element={<AdminBooksPage />}></Route>
          <Route path="users" element={<AdminUserPage />}></Route>
          <Route path="fines" element={<AdminFinePage />} />
        </Route>
      </Route>

      {/* Protected routes for user */}
      <Route element={<ProtectedRoute allowedRole="user" />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashBoardPage />} />
          <Route path="books" element={<UserBooksPage/>}/>
        </Route>
      </Route>
      
    </Routes>
  );
};

export default App;
