"use client"
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/protected/ProtectedRoute";
import Dashboard from "@/components/dashboard/dashboard";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const HomePage = () => {
  const router = useRouter();

  return (
    <ProtectedRoute allowedRoles={["admin","owner"]}>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default HomePage;
