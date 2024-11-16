import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import ErrorAlert from "../common/ErrorAlert";
import SuccessAlert from "../common/SuccessAlert";
import { createRefillRequest, updateRefillRequest } from "../../api/refills";

export default function RefillRequestForm({ request = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const medication_id =
    location?.state?.medicationId || request?.medication?.id;
  const medicationName =
    location?.state?.medicationName || request?.medication?.name;
  const medicationImage =
    location?.state?.medicationImage || request?.medication?.image;

  const [medicationId, setMedicationId] = useState(
    medication_id || request?.medication?.id || ""
  );
  const [quantity, setQuantity] = useState(request?.quantity || "");
  const [firstName, setFirstName] = useState(request?.first_name || "");
  const [lastName, setLastName] = useState(request?.last_name || "");
  const [email, setEmail] = useState(request?.email || "");
  const [country, setCountry] = useState(request?.country || "");
  const [city, setCity] = useState(request?.city || "");
  const [street, setStreet] = useState(request?.street || "");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axiosInstance.get("/medications/");
      } catch (err) {
        setError("Failed to fetch medications");
      }
    };

    fetchMedications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!medicationId || !quantity || !firstName || !lastName || !email) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const requestData = {
        medication_id: medicationId,
        quantity,
        first_name: firstName,
        last_name: lastName,
        email,
        country,
        city,
        street,
      };

      if (request) {
        await updateRefillRequest(request.id, requestData);
      } else {
        await createRefillRequest(requestData);
      }
      setSuccess(true);
      setError(null);
      navigate("/refill-requests");
    } catch (err) {
      setError("Failed to submit refill request");
      setSuccess(false);
    }
  };

  if (!medicationId) {
    navigate("/");
  }

  return (
    <div className="card p-5">
      <h2 className="text-2xl font-bold mb-6">Request a Refill</h2>

      {error && <ErrorAlert message={error} />}
      {success && (
        <SuccessAlert
          message={
            request
              ? "Refill request updated successfully!"
              : "Refill request submitted successfully!"
          }
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label
            htmlFor="medication_id"
            className="block text-sm font-medium mb-2"
          >
            Medication Name
          </label>
          <input
            type="text"
            value={medicationName}
            disabled
            className="form-control w-full px-3 py-2 border rounded-md"
          />
          {medicationImage && (
            <div className="mt-2">
              <p className="text-sm font-medium">Selected Medication</p>
              <img
                src={medicationImage}
                alt="Current medication"
                className="mt-2 max-h-48 rounded-md"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="quantity" className="block text-sm font-medium mb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Quantity"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="first_name"
            className="block text-sm font-medium mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name" className="block text-sm font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="country" className="block text-sm font-medium mb-2">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={country}
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="form-group">
          <label htmlFor="city" className="block text-sm font-medium mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={city}
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="form-group">
          <label htmlFor="street" className="block text-sm font-medium mb-2">
            Street
          </label>
          <input
            type="text"
            id="street"
            name="street"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-outline-primary w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {request ? "Update" : "Create"} Refill Request
          </button>
        </div>
      </form>
    </div>
  );
}
