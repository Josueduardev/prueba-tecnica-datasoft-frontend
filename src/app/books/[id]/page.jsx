"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBook, updateBook, getCategories } from "@/lib/api";

export default function BookDetail({ params }) {
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    price: "",
    state: "",
    imageUrl: "",
    idCategory: "",
    idUser: "",
  });

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      try {
        const resolvedParams =
          typeof params?.then === "function" ? await params : params;
        const { id } = resolvedParams || {};
        const [data, cats] = await Promise.all([getBook(id), getCategories()]);
        if (isActive) {
          setBook(data);
          setCategories(cats || []);
          setFormData({
            name: data?.name || "",
            summary: data?.summary || "",
            price: data?.price ?? "",
            state: data?.state || "",
            imageUrl: data?.imageUrl || "",
            idCategory: data?.category?.id ?? data?.idCategory ?? "",
            idUser: data?.user?.id ?? data?.idUser ?? "",
          });
        }
      } catch (err) {
        if (isActive) setError(err?.message || "No se pudo cargar el libro.");
      } finally {
        if (isActive) setLoading(false);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess("");
    setSaving(true);
    try {
      const resolvedParams =
        typeof params?.then === "function" ? await params : params;
      const { id } = resolvedParams || {};
      const payload = {
        name: formData.name?.trim(),
        summary: formData.summary?.trim(),
        price: formData.price === "" ? null : Number(formData.price),
        state: formData.state?.trim(),
        imageUrl: formData.imageUrl?.trim() || null,
        idCategory:
          formData.idCategory === "" ? null : Number(formData.idCategory),
        idUser: formData.idUser === "" ? null : Number(formData.idUser),
      };
      const updated = await updateBook(id, payload);
      setBook(updated || { ...book, ...payload });
      setSaveSuccess("Libro actualizado correctamente.");
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err?.message || "No se pudo actualizar el libro. Inténtalo nuevamente."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <h2 className="text-xl">Cargando libro…</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">{error}</h2>
        <Link
          href="/books"
          className="bg-indigo-500 text-white px-5 py-2 rounded-xl hover:bg-indigo-600 transition"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">Libro no encontrado 📚</h2>
        <Link
          href="/books"
          className="bg-indigo-500 text-white px-5 py-2 rounded-xl hover:bg-indigo-600 transition"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-3xl w-full">
        <img
          src={book.imageUrl}
          alt={book.name}
          className="w-full h-96 object-contain"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.name}</h1>
          <p className="text-gray-700 mb-6 leading-relaxed">{book.summary}</p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-indigo-600">
              ${book.price}
            </span>

            <span
              className={`text-sm px-3 py-1 rounded-full ${
                book.state === "ACTIVO"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {book.state}
            </span>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/books"
              className="bg-indigo-500 text-white px-6 py-2 rounded-xl hover:bg-indigo-600 transition"
            >
              ← Volver a la lista
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-3xl w-full mt-6">
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Editar libro
            </h2>
            <button
              onClick={() => setIsEditing((v) => !v)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? "Cancelar" : "Editar"}
            </button>
          </div>

          {saveError && (
            <p className="mb-3 text-sm text-red-600">{saveError}</p>
          )}
          {saveSuccess && (
            <p className="mb-3 text-sm text-green-700">{saveSuccess}</p>
          )}

          {isEditing && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Resumen
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-1 w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="ACTIVO / INACTIVO"
                    className="mt-1 w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoría
                  </label>
                  <select
                    name="idCategory"
                    value={formData.idCategory}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="" disabled>
                      Selecciona una categoría
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Imagen (URL)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Usuario (ID)
                  </label>
                  <input
                    type="number"
                    name="idUser"
                    value={formData.idUser}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
