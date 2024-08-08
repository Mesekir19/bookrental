"use client";
import ProtectedRoute from "@/components/protected/ProtectedRoute";
import OwnerTable from "@/components/owners/ownersTable";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const OwnersPage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <OwnerTable />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default OwnersPage;
