"use client";
import React, { useEffect, useState } from "react";
import { getBooks, getBooksByCategory } from "@/lib/api";
import { useRouter } from "next/navigation";

const BookList = ({ category }) => {
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = category
          ? await getBooksByCategory(category)
          : await getBooks();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [category]);

  const handleViewDetail = (book) => {
    router.push(`/books/${book.id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Lista de Libros
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
          >
            <img
              src={book.imageUrl}
              alt={book.name}
              className="w-full h-70 object-cover"
            />

            <div className="p-4 flex flex-col grow">
              <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {book.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {book.summary}
              </p>

              <div className="mt-auto flex justify-between items-center pt-4">
                <span className="text-lg font-bold text-indigo-600">
                  ${book.price}
                </span>

                <button
                  onClick={() => handleViewDetail(book)}
                  className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-600 transition"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
