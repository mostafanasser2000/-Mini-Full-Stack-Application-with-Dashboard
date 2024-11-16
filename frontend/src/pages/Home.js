import React from "react";
import useAuth from "../hooks/useAuth";
import MedicationList from "../components/medications/MedicationList";

const Home = () => {
  const { isLoading } = useAuth();
  return (
    <div className="container my-3">
      {isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : null}
      <MedicationList />
    </div>
  );
};

export default Home;
