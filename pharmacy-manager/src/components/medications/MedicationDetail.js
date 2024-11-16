import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { getMedicationDetails, deleteMedication } from "../../api/medications";
import Loading from "../common/Loading";
import ErrorAlert from "../common/ErrorAlert";
import SuccessAlert from "../common/SuccessAlert";
import useAuth from "../../hooks/useAuth";
import MedicationForm from "./MedicationForm";

const MedicationDetail = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { slug } = useParams();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicationDetails = async () => {
      try {
        setLoading(true);
        const medicationData = await getMedicationDetails(slug);
        setMedication(medicationData);
      } catch (err) {
        navigate("/");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicationDetails();
  }, [slug]);

  const handleDelete = async () => {
    try {
      await deleteMedication(slug);
      setSuccess(true);
      navigate("/medications");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="container my-5 card p-5">
      {medication && (
        <div className="row">
          <div className="col-md-6">
            <img
              src={medication.image}
              alt={medication.name}
              className="img-fluid rounded"
              style={{ height: "300px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-between card p-4">
            <div>
              <h3 className="mb-2">{medication.name}</h3>
              <p className="card-text mb-2 border-bottom-2">
                {medication.description}
              </p>
              <hr></hr>
              <p className="card-text mb-3 mt-4">
                <strong>Category:</strong> {medication.category.name}
              </p>
              <p className="card-text mb-3">
                <strong>Price:</strong> ${medication.price}
              </p>
              <p
                className={`card-text mb-2 ${
                  medication.available ? "text-success" : "text-danger"
                }`}
              >
                {medication.available ? (
                  <>
                    <CheckCircle size={20} className="me-2" /> In Stock
                  </>
                ) : (
                  <>
                    <XCircle size={20} className="me-2" /> Out of Stock
                  </>
                )}
              </p>
              <p className="card-text mb-2">
                <strong>Form:</strong> {medication.form}
              </p>
              <p className="card-text mb-2">
                <strong>Manufacturer:</strong> {medication.manufacturer}
              </p>
              {isAuthenticated && isAdmin && (
                <>
                  <p className="card-text mb-2">
                    <p className="card-text mb-2">
                      <strong>Remaning Quantity:</strong> {medication.quantity}
                    </p>
                    <strong>Expiry Date:</strong> {medication.expiry_date}
                  </p>
                </>
              )}
            </div>
            <div className="d-flex justify-content-end">
              {isAuthenticated && isAdmin && (
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
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </>
              )}
              {isAuthenticated && !isAdmin && medication.available && (
                <button
                  className="btn btn-outline-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/refill-requests/create/", {
                      state: {
                        medicationId: medication.id,
                        medicationName: medication.name,
                        medicationImage: medication.image,
                      },
                    });
                  }}
                >
                  <i className="fa fa-sync-alt me-2"></i> Refill
                </button>
              )}
            </div>
          </div>
          {isUpdating && <MedicationForm medication={medication} />}
        </div>
      )}

      {success && <SuccessAlert message="Action successful!" />}
    </div>
  );
};

export default MedicationDetail;
