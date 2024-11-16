import React, { useState } from "react";
import { createCategory } from "../api/categories";
import ErrorAlert from "./common/ErrorAlert";
import SuccessAlert from "./common/SuccessAlert";

const CategoryForm = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ name });
      setName("");
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Create Category</h1>
      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message="Category created successfully." />}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
