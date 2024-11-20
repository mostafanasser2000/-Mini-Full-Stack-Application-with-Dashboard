import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getRefillRequests } from "../api/refills";
import RefillRequestList from "../components/refills/RefillsRequestList";
import Loading from "../components/common/Loading";
import ErrorAlert from "../components/common/ErrorAlert";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [refillRequests, setRefillRequests] = useState([]);
  const [error, setError] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    
    const fetchData = async () => {
      if (isAuthenticated) {
        setIsDataLoading(true);
        try {
          const [refillData] = await Promise.all([getRefillRequests()]);
          setRefillRequests(refillData);
        } catch (err) {
          setError("Error fetching data");
        } finally {
          setIsDataLoading(false);
        }
      }
    };

    fetchData();
  }, [isAuthenticated, isLoading, navigate]);

  
  if (isLoading || isDataLoading) {
    return <Loading />;
  }

  
  if (error) {
    return <ErrorAlert message={error} />;
  }

  
  return (
    <div className="container mx-auto p-4">
      <RefillRequestList refillRequests={refillRequests} />
    </div>
  );
};

export default Dashboard;
