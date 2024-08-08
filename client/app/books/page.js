// pages/books.js
"use client";
import ProtectedRoute from "@/components/protected/ProtectedRoute";
import Books from "@/components/books/booksTable";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const BooksPage = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Books />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default BooksPage;
