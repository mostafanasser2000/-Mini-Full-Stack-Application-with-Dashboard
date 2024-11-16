import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Loading from "../common/Loading";
import ErrorAlert from "../common/ErrorAlert";
import SuccessAlert from "../common/SuccessAlert";
import useAuth from "../../hooks/useAuth";
import RefillRequestForm from "./RefillRequestForm";
import axiosInstance from "../../api/axiosConfig";

const RefillRequestDetail = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { isAdmin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRefillRequestDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/refill-requests/${id}/`);
        setRequest(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRefillRequestDetails();
  }, [id]);

  // const handleCancel = async () => {
  //   try {
  //     await axiosInstance.delete(`/refill-requests/${id}/`);
  //     setSuccess(true);
  //     navigate("/refill-requests");
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // const handleStatusUpdate = async (newStatus) => {
  //   try {
  //     setLoading(true);
  //     await axiosInstance.post(`/refill-requests/${id}/approve/`);
  //     const response = await axiosInstance.get(`/refill-requests/${id}/`);
  //     setRequest(response.data);
  //     setSuccess(true);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={20} className="me-2" />;
      case "approved":
        return <CheckCircle size={20} className="me-2" />;
      case "rejected":
        return <XCircle size={20} className="me-2" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (!isAuthenticated || (!isAdmin && user.email !== request.user.email)) {
    navigate("/");
  }
  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="container my-5 card p-5">
      {request && (
        <div className="row">
          <div className="col-md-6">
            <img
              src={request.medication.image}
              alt={request.medication.name}
              className="img-fluid rounded"
              style={{ height: "300px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-between card p-4">
            <div>
              <p className="card-text mb-2 border-bottom-2">
                <strong>Medication:</strong> {request.medication.name}
              </p>
              <hr />
              <div className="mt-4">
                <p className="card-text mb-3">
                  <strong>Quantity:</strong> {request.quantity}
                </p>
                <p className="card-text mb-3">
                  <strong>Doctor:</strong> {request.first_name}{" "}
                  {request.last_name}
                </p>
                <p className="card-text mb-3">
                  <strong>Email:</strong> {request.email}
                </p>
                <p className="card-text mb-3">
                  <strong>Address:</strong> {request.street}, {request.city},{" "}
                  {request.country}
                </p>
                <p
                  className={`card-text mb-3 ${getStatusColor(request.status)}`}
                >
                  <strong>Status:</strong>{" "}
                  <span className="d-flex align-items-center">
                    {getStatusIcon(request.status)}
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </span>
                </p>
                <p className="card-text mb-3">
                  <strong>Request Date:</strong>{" "}
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              {/* {isAuthenticated && isAdmin && request.status === "pending" && (
                <>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => handleStatusUpdate("approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleStatusUpdate("rejected")}
                  >
                    Reject
                  </button>
                </>
              )} */}
              {isAuthenticated &&
                !isAdmin &&
                user.email === request.user.email &&
                request?.status === "pending" && (
                  <>
                    {isUpdating ? (
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => setIsUpdating(false)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => setIsUpdating(true)}
                      >
                        Update
                      </button>
                    )}
                    {/* {request.status === "pending" && (
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleCancel(request.id)}
                      >
                        Cancel
                      </button>
                    )} */}
                  </>
                )}
            </div>
          </div>
          {isUpdating && <RefillRequestForm request={request} />}
        </div>
      )}

      {success && <SuccessAlert message="Action successful!" />}
    </div>
  );
};

export default RefillRequestDetail;
