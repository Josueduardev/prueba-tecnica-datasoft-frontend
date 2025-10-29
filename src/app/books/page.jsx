"use client";
import React, { useState } from "react";
import BookList from "@/components/books/BookList";
import CategoryFilter from "@/components/books/CategoryFilter";

const BooksPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Libros</h1>
          <CategoryFilter onCategoryChange={handleCategoryChange} />
        </div>
        <BookList category={selectedCategory} />
      </div>
    </div>
  );
};

export default BooksPage;
