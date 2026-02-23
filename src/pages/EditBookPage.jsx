import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {FilePenLine} from "lucide-react"

export default function EditBookPage({ books, updateBook }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = books.find((b) => b.id === id);

  const [form, setForm] = useState({
    title: book?.title || "",
    author: book?.author || "",
    notes: book?.notes || "",
    isbn: book?.isbn || "",
    status: book?.status || "reading",
    rating: book?.rating || 0,
  });

  const cleanISBN = (isbn) => isbn?.replace(/[-\s]/g, "");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const isbn = cleanISBN(form.isbn?.trim());
    // const isbn = form.isbn?.trim();

    updateBook({
        ...book,
        ...form,
        isbn,
        coverUrl: isbn
        ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
        : null,
        rating: Number(form.rating),
        updatedAt: Date.now(),
    });

    navigate("/");
 }


  if (!book) {
    return (
      <div className="p-6 text-center text-stone-600">
        Book not found
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-stone-500 mb-4"
      >
        ← Back
      </button>
      {/* <h1 className="text-2xl font-semibold mb-6">
        Edit Book
      </h1> */}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4"
      >

        <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#f2ecea] flex items-center justify-center text-lg">
                <FilePenLine size={21} color="#7a462e"/>
            </div>
      
            <div className="leading-tight">
              <h1 className="text-2xl font-semibold">Edit Book</h1>
                <p className="text-xs text-stone-500">
                    Refine your book notes.
                </p>
            </div>
        </div>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"
        />

        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"
        />

        <input
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"
        />

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm h-24"
        />

        <div className="flex gap-3">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm"
          >
            <option>Reading</option>
            <option>Finished</option>
            {/* <option>Planned</option> */}
          </select>

          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value={0}>No Rating</option>
            <option value={1}>⭐ 1</option>
            <option value={2}>⭐ 2</option>
            <option value={3}>⭐ 3</option>
            <option value={4}>⭐ 4</option>
            <option value={5}>⭐ 5</option>
          </select>
        </div>

        <button className="w-full bg-[#7a462e] text-white py-2 rounded-lg hover:bg-amber-950 transition">
          Save Changes
        </button>
      </form>
    </div>
  );
}
