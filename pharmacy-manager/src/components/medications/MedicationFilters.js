import React, { useState, useEffect } from "react";
import { getCategories } from "../../api/categories";

const MedicationFilters = ({ onFiltersChange }) => {
  const [categories, setCategories] = useState([]);
  const [categorySlug, setCategorySlug] = useState("");
  const [available, setAvailable] = useState(null);
  const [form, setForm] = useState("");
  const [error, setError] = useState(null);

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
  const handleApplyFilters = () => {
    const filters = {
      category: categorySlug || "",
      available: available !== null ? available : undefined,
      form: form !== "" ? form : undefined,
    };
    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    setCategories([]);
    setAvailable(null);
    setForm("");
    onFiltersChange({});
  };

  return (
    <div className="mb-2 p-2 border rounded shadow-sm bg-white">
      <div className="row mb-2 align-items-end">
        <div className="col-md-3 mb-2">
          <label htmlFor="categorySlug" className="form-label">
            Category
          </label>
          <select
            id="categorySlug"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <label htmlFor="available" className="form-label">
            Available:
          </label>
          <select
            id="available"
            value={available === null ? "" : available.toString()}
            onChange={(e) => setAvailable(e.target.value === "true")}
            className="form-select"
          >
            <option value="">All</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <label htmlFor="form" className="form-label">
            Form:
          </label>
          <select
            id="form"
            value={form}
            onChange={(e) => setForm(e.target.value)}
            className="form-select"
          >
            <option value="">All</option>
            <option value="tablet">Tablet</option>
            <option value="capsules">Capsules</option>
            <option value="liquid">Liquid</option>
            <option value="topical">Topical</option>
            <option value="drops">Drops</option>
            <option value="suppositories">Suppositories</option>
            <option value="inhalers">Inhalers</option>
            <option value="injections">Injections</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <button
            onClick={handleApplyFilters}
            className="btn btn-primary w-100"
          >
            <i className="fas fa-filter me-2"></i> Apply Filters
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button onClick={handleClearFilters} className="btn btn-secondary">
          <i className="fas fa-times-circle me-2"></i> Clear Filters
        </button>
      </div>
    </div>
  );
};

export default MedicationFilters;
