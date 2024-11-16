import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.js";
import Navbar from "./components/common/Navbar.js";
import PrivateRoute from "./components/common/PrivateRoute.js";
import AdminRoute from "./components/common/AdminRoute.js";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Dashboard from "./pages/Dashboard.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import MedicationDetail from "../src/components/medications/MedicationDetail.js";
import MedicationForm from "./components/medications/MedicationForm.js";
import MedicationList from "./components/medications/MedicationList.js";
import RefillRequestList from "./components/refills/RefillsRequestList.js";
import RefillRequestForm from "./components/refills/RefillRequestForm.js";
import RefillRequestDetail from "./components/refills/RefillRequestDetail.js";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/medications/" element={<MedicationList />} />
          {/* <Route path="/medications/search/?q" element={<MedicationList />} /> */}

          <Route
            path="/medications/add/"
            element={
              <PrivateRoute>
                <MedicationForm />
              </PrivateRoute>
            }
          />
          <Route path="/medications/:slug" element={<MedicationDetail />} />
          <Route
            path="/medications/edit/:slug"
            element={
              <PrivateRoute>
                <MedicationForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/refill-requests/"
            element={
              <PrivateRoute>
                <RefillRequestList />
              </PrivateRoute>
            }
          />
          <Route
            path="/refill-requests/:id"
            element={
              <PrivateRoute>
                <RefillRequestDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/refill-requests/create/"
            element={
              <PrivateRoute>
                <RefillRequestForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/refill-requests/edit/:id"
            element={
              <PrivateRoute>
                <RefillRequestForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
