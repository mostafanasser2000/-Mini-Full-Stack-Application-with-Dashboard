import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="row justify-content-center align-items-center m-4">
      <div className="col-md-8 col-lg-6">
        <div className="card auth-card">
          <div className="card-body">
            <LoginForm onSubmit={handleLogin} />
            <div className="auth-links mt-4">
              <p className="text-center mb-2">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
