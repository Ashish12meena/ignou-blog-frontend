import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth by userId from localStorage
    const userId = localStorage.getItem("userId");
    setIsAuthenticated(!!userId);
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/start");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return <div></div>; // or a loader
  }

  return isAuthenticated ? element : null;
};

export default PrivateRoute;
