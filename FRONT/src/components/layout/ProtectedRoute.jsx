import React from "react";
import { Navigate } from "react-router-dom";
import { useToken } from "../contexts/session.context";

const ProtectedRoute = ({ children }) => {
    const token = useToken();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;