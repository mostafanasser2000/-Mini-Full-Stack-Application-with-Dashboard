import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categories';
import Loading from '../components/common/Loading';
import ErrorAlert from '../components/common/ErrorAlert';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.slug}`}
            className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition-colors duration-300"
          >
            <h2 className="text-lg font-medium mb-2">{category.name}</h2>
            <p className="text-gray-600 mb-4">{category.slug}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;