import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

import { getMedications } from "../../api/medications";
import MedicationFilters from "./MedicationFilters";
import Loading from "../common/Loading";
import ErrorAlert from "../common/ErrorAlert";
import useAuth from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatters";

const MedicationList = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [medications, setMedications] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        const medicationsData = await getMedications(filters);
        setMedications(medicationsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }
  return (
    <div>
      <h1 className="text-center mb-4">Medications</h1>
      <MedicationFilters onFiltersChange={handleFiltersChange} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        {isAdmin && (
          <Link to={`/medications/add/`} className="btn btn-success">
            <i className="fas fa-plus-circle me-2"></i> Add Medication
          </Link>
        )}
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {medications.map((medication) => (
          <div key={medication.id} className="col">
            <div
              className="card shadow-sm h-100 cursor-pointer"
              onClick={() => navigate(`/medications/${medication.slug}`)}
            >
              <img
                src={medication.image}
                alt={medication.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{medication.name}</h5>
                <p className="card-text mb-2">
                  <strong>Category:</strong> {medication.category.name}
                </p>
                <p className="card-text mb-2">
                  <strong>Price:</strong> {formatCurrency(medication.price)}
                </p>
                <p
                  className={`card-text mb-0 ${
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
              </div>
              <div className="card-footer">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationList;
