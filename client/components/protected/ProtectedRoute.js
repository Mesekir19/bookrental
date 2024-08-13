"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import { UserContext } from "@/Context/UserContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          router.push("/auth/login");
        } else {
          const role = decodedToken.role;
          setUserRole(role);
          setUserId(decodedToken.id);

          // Check if the user has the required role
          if (!allowedRoles.includes(role)) {
            router.push("/unauthorized"); // Redirect to an unauthorized page
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/auth/login");
      }
    }
  }, [router, allowedRoles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <UserContext.Provider value={{ userId, userRole }}>
        {children}
      </UserContext.Provider>
  );
};

export default ProtectedRoute;
