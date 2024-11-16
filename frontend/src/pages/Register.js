import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="row justify-content-center align-items-center m-4">
      <div className="col-md-8 col-lg-6">
        <div className="card auth-card">
          <div className="card-body">
            <RegisterForm onSubmit={handleRegister} />
            <div class="auth-links mt-4">
              <p className="text-center mb-2">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-600">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
