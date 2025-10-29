"use client";
import React, { useEffect, useState } from "react";
import { getCategories } from "@/lib/api";

const CategoryFilter = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="category" className="text-sm font-medium text-gray-700">
        Filtrar por categorias:
      </label>
      <select
        id="category"
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
