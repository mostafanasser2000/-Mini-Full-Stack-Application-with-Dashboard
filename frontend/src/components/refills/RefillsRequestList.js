import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Loading from "../common/Loading";
import ErrorAlert from "../common/ErrorAlert";
import useAuth from "../../hooks/useAuth";
import {
  getRefillRequests,
  approveRefillRequest,
  cancelRefillRequest,
  rejectRefillRequest,
} from "../../api/refills";
import { formatNumber, formatDate } from "../../utils/formatters";

const RefillRequestList = () => {
  const [refillRequests, setRefillRequests] = useState([]);
  const [stats, setStats] = useState({
    total_requests: 0,
    total_approved: 0,
    total_rejected: 0,
    total_pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  const COLORS = ["#3B82F6", "#EAB308", "#22C55E", "#EF4444"];
  const navigate = useNavigate();

  const calculateStats = (requests) => {
    return requests.reduce(
      (acc, curr) => {
        acc.total_requests++;
        if (curr.status === "approved") acc.total_approved++;
        if (curr.status === "rejected") acc.total_rejected++;
        if (curr.status === "pending") acc.total_pending++;
        return acc;
      },
      {
        total_requests: 0,
        total_approved: 0,
        total_rejected: 0,
        total_pending: 0,
      }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const requests = await getRefillRequests();
        setRefillRequests(requests);
        setStats(calculateStats(requests));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateRequestStatus = (id, newStatus) => {
    const updatedRequests = refillRequests.map((request) =>
      request.id === id ? { ...request, status: newStatus } : request
    );
    setRefillRequests(updatedRequests);
    setStats(calculateStats(updatedRequests));
  };

  async function handleCancelRequest(id) {
    try {
      setLoading(true);
      await cancelRefillRequest(id);
      updateRequestStatus(id, "cancelled");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRejectRequest(id) {
    try {
      setLoading(true);
      await rejectRefillRequest(id);
      updateRequestStatus(id, "rejected");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApproveRequest(id) {
    try {
      setLoading(true);
      await approveRefillRequest(id);
      updateRequestStatus(id, "approved");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const doughnutData = [
    { name: "Total", value: stats.total_requests },
    { name: "Pending", value: stats.total_pending },
    { name: "Approved", value: stats.total_approved },
    { name: "Rejected", value: stats.total_rejected },
  ];

  const total = doughnutData.reduce((sum, item) => sum + item.value, 0);
  const getPercentage = (value) => ((value / total) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{payload[0].name}</p>
          <p>Count: {formatNumber(payload[0].value)}</p>
          <p>Percentage: {getPercentage(payload[0].value)}%</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Refill Requests Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500 text-white rounded-lg p-6 shadow-lg">
            <h5 className="text-lg font-semibold mb-2">Total Requests</h5>
            <p className="text-4xl font-bold">
              {formatNumber(stats.total_requests)}
            </p>
          </div>

          <div className="bg-yellow-500 text-white rounded-lg p-6 shadow-lg">
            <h5 className="text-lg font-semibold mb-2">Pending Requests</h5>
            <p className="text-4xl font-bold">
              {formatNumber(stats.total_pending)}
            </p>
          </div>

          <div className="bg-green-500 text-white rounded-lg p-6 shadow-lg">
            <h5 className="text-lg font-semibold mb-2">Approved Requests</h5>
            <p className="text-4xl font-bold">
              {formatNumber(stats.total_approved)}
            </p>
          </div>

          <div className="bg-red-500 text-white rounded-lg p-6 shadow-lg">
            <h5 className="text-lg font-semibold mb-2">Rejected Requests</h5>
            <p className="text-4xl font-bold">
              {formatNumber(stats.total_rejected)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Request Distribution</h2>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="w-full md:w-2/3 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={doughnutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {doughnutData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0">
              {doughnutData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Requests</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Approved at</th>
                    <th className="px-4 py-2 text-left">Medication</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Doctor</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {refillRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {formatDate(request.created_at)}
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(request.approved_at)}
                      </td>
                      <td className="px-4 py-2">{request.medication.name}</td>
                      <td className="px-4 py-2">
                        {formatNumber(request.quantity)}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {request.first_name} {request.last_name}
                      </td>
                      <td className="px-4 py-2">{request.email}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2 flex-nowrap min-w-max">
                          <button
                            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-1 rounded transition-all duration-200"
                            onClick={() =>
                              navigate(`/refill-requests/${request.id}`)
                            }
                          >
                            View
                          </button>
                          {isAdmin && request.status === "pending" && (
                            <>
                              <button
                                className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1 rounded transition-all duration-200"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition-all duration-200"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {!isAdmin && request.status === "pending" && (
                            <>
                              <button
                                className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition-all duration-200"
                                onClick={() => handleCancelRequest(request.id)}
                              >
                                Cancel
                              </button>
                              <button
                                className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white px-3 py-1 rounded transition-all duration-200"
                                onClick={() =>
                                  navigate(`/refill-requests/${request.id}`, {
                                    state: { isUpdating: true },
                                  })
                                }
                              >
                                Update
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefillRequestList;
