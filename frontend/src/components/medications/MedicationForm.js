import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createMedication, updateMedication } from "../../api/medications";
import { getCategories } from "../../api/categories";
import ErrorAlert from "../common/ErrorAlert";
import SuccessAlert from "../common/SuccessAlert";
import useAuth from "../../hooks/useAuth";
import Loading from "../common/Loading";

const MedicationForm = ({ medication = null }) => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(medication?.name || "");
  const [description, setDescription] = useState(medication?.description || "");
  const [form, setForm] = useState(medication?.form || "tablet");
  const [categoryId, setCategoryId] = useState(medication?.category?.id || "");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(medication?.image || null);
  const [price, setPrice] = useState(medication?.price || "");
  const [quantity, setQuantity] = useState(medication?.quantity || "");
  const [available, setAvailable] = useState(medication?.available || true);
  const [manufacturer, setManufacturer] = useState(
    medication?.manufacturer || ""
  );
  const [expiry, setExpiry] = useState(
    medication?.expiry_date ? medication.expiry_date.split("T")[0] : ""
  );
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setExistingImage(null); // Clear existing image when new file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const medicationData = new FormData();
      medicationData.append("name", name);
      medicationData.append("description", description);
      medicationData.append("form", form);
      medicationData.append("category_id", categoryId);
      medicationData.append("price", price);
      medicationData.append("quantity", quantity);
      medicationData.append("available", available);
      medicationData.append("manufacturer", manufacturer);
      medicationData.append("expiry_date", expiry);

      // Handle image upload
      if (imageFile) {
        medicationData.append("image", imageFile);
      } else if (existingImage && medication) {
        medicationData.append("existing_image", existingImage);
      }

      if (medication) {
        await updateMedication(medication.slug, medicationData);
      } else {
        await createMedication(medicationData);
      }

      setSuccess(true);
      setError(null);
      navigate("/medications");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSuccess(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="card p-5">
      <h2 className="text-2xl font-bold mb-6">
        {medication ? "Update Medication" : "Create Medication"}
      </h2>

      {error && <ErrorAlert message={error} />}
      {success && (
        <SuccessAlert
          message={
            medication
              ? "Medication updated successfully!"
              : "Medication created successfully!"
          }
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="form" className="block text-sm font-medium mb-2">
            Form
          </label>
          <select
            id="form"
            value={form}
            onChange={(e) => setForm(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="tablet">Tablet</option>
            <option value="capsules">Capsules</option>
            <option value="topical">Topical</option>
            <option value="drops">Drops</option>
            <option value="suppositories">Suppositories</option>
            <option value="inhalers">Inhalers</option>
            <option value="injections">Injections</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium mb-2"
          >
            Category
          </label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            Image
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            onChange={handleImageChange}
            className="form-control w-full px-3 py-2 border rounded-md"
          />
          {existingImage && !imageFile && (
            <div className="mt-2">
              <p className="text-sm font-medium">Current Image:</p>
              <img
                src={existingImage}
                alt="Current medication"
                className="mt-2 max-h-48 rounded-md"
              />
            </div>
          )}
          {imageFile && (
            <div className="mt-2">
              <p className="text-sm font-medium">New Image Preview:</p>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="New medication preview"
                className="mt-2 max-h-48 rounded-md"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity" className="block text-sm font-medium mb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="available"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            <span className="text-sm font-medium">Available</span>
          </label>
        </div>

        <div className="form-group">
          <label
            htmlFor="manufacturer"
            className="block text-sm font-medium mb-2"
          >
            Manufacturer
          </label>
          <input
            type="text"
            id="manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiry" className="block text-sm font-medium mb-2">
            Expiry Date
          </label>
          <input
            type="date"
            id="expiry"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="form-control w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {medication ? "Update" : "Create"} Medication
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicationForm;
