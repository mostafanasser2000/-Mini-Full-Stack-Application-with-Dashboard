import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Disclosure, Transition } from "@headlessui/react";
import useAuth from "../../hooks/useAuth";

const ResponsiveNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.q.value.trim();
    if (query) {
      navigate(`/medications?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Disclosure
      as="nav"
      className="navbar navbar-expand-lg navbar-light bg-light card"
    >
      {({ open }) => (
        <>
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center">
                <Link to="/" className="navbar-brand custom-logo me-3">
                  Pyramids Pharmacy
                </Link>
                <form className="d-flex search-form" onSubmit={handleSearch}>
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search medications..."
                    aria-label="Search"
                    name="q"
                  />
                  <button className="btn btn-outline-primary" type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </form>
              </div>

              <div className="d-none d-lg-flex align-items-center mx-auto">
                <Link to="/medications" className="nav-link text-black">
                  Medications
                </Link>
                {user && (
                  <Link to="/dashboard" className="nav-link text-black">
                    Dashboard
                  </Link>
                )}
                {user?.is_admin && (
                  <Link to="/admin" className="nav-link text-black">
                    Admin
                  </Link>
                )}
              </div>

              <div className="d-flex align-items-center">
                {user ? (
                  <div className="d-flex align-items-center">
                    <span className="nav-link">{user.email}</span>
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-primary ms-2"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <Link to="/login" className="btn btn-outline-primary">
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-outline-success ms-2"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <Disclosure.Button className="navbar-toggler d-lg-none">
              <span className="navbar-toggler-icon"></span>
            </Disclosure.Button>

            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="d-lg-none w-100">
                <div className="navbar-nav">
                  <Link to="/medications" className="nav-link text-black">
                    Medications
                  </Link>
                  {user && (
                    <Link to="/dashboard" className="nav-link text-black">
                      Dashboard
                    </Link>
                  )}
                  {user?.is_admin && (
                    <Link to="/admin" className="nav-link text-black">
                      Admin
                    </Link>
                  )}
                  <form
                    className="d-flex search-form my-2"
                    onSubmit={handleSearch}
                  >
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Search medications..."
                      aria-label="Search"
                      name="q"
                    />
                    <button className="btn btn-outline-primary" type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </form>
                  {user ? (
                    <>
                      <span className="nav-link">{user.email}</span>
                      <button
                        onClick={handleLogout}
                        className="nav-link text-danger border-0 bg-transparent w-100 text-start"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="nav-link text-black">
                        Login
                      </Link>
                      <Link to="/register" className="nav-link text-black">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default ResponsiveNavbar;
