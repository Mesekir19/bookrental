"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import { defineAbilitiesFor } from "@/utils/abilities"; // Adjust the path accordingly
import { AbilityContext } from "@/Context/AbilityContext"; // Adjust the path accordingly
import { UserContext } from "@/Context/UserContext"; // Adjust the path accordingly

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ability, setAbility] = useState(null);
  const [userRole, setUserRole] = useState(null); // State for user role
  const [userId, setUserId] = useState(null); // State for user ID

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      router.push("/auth/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Optionally check for token expiration
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.error("Token has expired");
          localStorage.removeItem("token");
          router.push("/auth/login");
        } else {
          const role = decodedToken.role; // Adjust based on your token structure
          const abilities = defineAbilitiesFor(role);
          setAbility(abilities);
          setUserRole(role); // Set user role
          setUserId(decodedToken.id); // Set user ID
          setLoading(false); // Set loading to false if token is valid
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        router.push("/auth/login");
      }
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <AbilityContext.Provider value={ability}>
      <UserContext.Provider value={{ userId, userRole }}>
        {children}
      </UserContext.Provider>
    </AbilityContext.Provider>
  );
};

export default ProtectedRoute;
