import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  return user;
};

export default useAuth;
