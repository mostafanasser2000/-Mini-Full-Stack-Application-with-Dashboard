
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axiosInstance from "../api/axiosConfig";
import ErrorAlert from "../components/common/ErrorAlert";

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    totalMedications: 0,
    totalCategories: 0,
    totalRefillRequests: 0,
    pendingRefillRequests: 0,
  });
  const [refillRequestData, setRefillRequestData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [medicationsResponse, categoriesResponse, refillRequestsResponse] =
        await Promise.all([
          axiosInstance.get("/medications/"),
          axiosInstance.get("/categories/"),
          axiosInstance.get("/refill-requests/"),
        ]);

      setStatistics({
        totalMedications: medicationsResponse.data.length,
        totalCategories: categoriesResponse.data.length,
        totalRefillRequests: refillRequestsResponse.data.length,
        pendingRefillRequests: refillRequestsResponse.data.filter(
          (request) => request.status === "pending"
        ).length,
      });

      
      const refillRequestChartData = refillRequestsResponse.data.reduce(
        (acc, request) => {
          const date = new Date(request.created_at).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            }
          );
          const existingEntry = acc.find((entry) => entry.date === date);
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            acc.push({ date, count: 1 });
          }
          return acc;
        },
        []
      );
      setRefillRequestData(refillRequestChartData);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch dashboard data");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {error && <ErrorAlert message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-2">Total Medications</h3>
          <p className="text-4xl font-bold text-indigo-600">
            {statistics.totalMedications}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-2">Total Categories</h3>
          <p className="text-4xl font-bold text-indigo-600">
            {statistics.totalCategories}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-2">Total Refill Requests</h3>
          <p className="text-4xl font-bold text-indigo-600">
            {statistics.totalRefillRequests}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-2">Pending Refill Requests</h3>
          <p className="text-4xl font-bold text-indigo-600">
            {statistics.pendingRefillRequests}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Refill Request Trends</h3>
        <LineChart width={800} height={400} data={refillRequestData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Actions</h3>
        <div className="space-x-4">
          <Link
            to="/admin/medications"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Medications
          </Link>
          <Link
            to="/admin/categories"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
