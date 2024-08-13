"use client";
import ProtectedRoute from "@/components/protected/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import UploadNewBook from "@/components/books/uploadBooks";

const BooksPage = () => {
  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <DashboardLayout>
        <UploadNewBook />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default BooksPage;
