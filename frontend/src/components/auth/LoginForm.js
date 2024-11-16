import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import ErrorAlert from "../common/ErrorAlert.js";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center px-3 py-4">
      <div className="mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="mt-4 text-center fw-bold fs-4 text-dark">Login</h2>
      </div>

      <div className="mt-5 mx-auto w-100" style={{ maxWidth: "400px" }}>
        {error && <ErrorAlert message={error} />}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await login(values.email, values.password);
              navigate("/dashboard");
            } catch (err) {
              setError(err.detail || "Invalid email or password");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="d-block text-body fs-6 fw-medium"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <Field
                    placeholder="Email Adress"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="form-control w-100 rounded shadow-sm border-0 py-2 text-dark placeholder-gray-400"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-2 text-danger fs-6">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="d-block text-body fs-6 fw-medium"
                >
                  Password
                </label>
                <div className="mt-2">
                  <Field
                    placeholder="Password"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="form-control w-100 rounded shadow-sm border-0 py-2 text-dark placeholder-gray-400"
                  />
                  {errors.password && touched.password && (
                    <p className="mt-2 text-danger fs-6">{errors.password}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
