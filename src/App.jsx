import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import AddBookPage from "./pages/AddBookPage";
import EditBookPage from "./pages/EditBookPage";
import Toast from "./components/Toast";
import Navbar from "./components/Navbar";
import BookDetailPage from "./pages/BookDetailPage";
import Footer from "./components/Footer";



export default function App() {
  const [books, setBooks] = useState([]);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  /* Optionally, we can have a separate state for the raw input to implement debouncing */
  const [rawSearch, setRawSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(rawSearch);
    }, 250);

    return () => clearTimeout(timer);
  }, [rawSearch]);


  const processedBooks = books
  .filter((book) => {
    if (filter === "reading") return book.status === "reading";
    if (filter === "finished") return book.status === "finished";
    return true; 
  })
  .filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);

      case "oldest":
        return (a.updatedAt || a.createdAt) - (b.updatedAt || b.createdAt);

      case "rating":
        return b.rating - a.rating;

      case "az":
        return a.title.localeCompare(b.title);

      case "za":
        return b.title.localeCompare(a.title);

      default:
        return 0;
    }
  });




  /* Load from localStorage once */
  useEffect(() => {
    const stored = localStorage.getItem("books");
    if (stored) {
      setBooks(JSON.parse(stored));
    }
  }, []);

  /* Persist whenever books change */
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);


  function addBook(book) {
    setBooks((prev) => [book, ...prev]);
    showToast("Book added");
  }

  function deleteBook(id) {
    setBooks((prev) => prev.filter((book) => book.id !== id));
    showToast("Book removed");
  }


  function updateRating(id, rating) {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id ? { ...book, rating, updatedAt: Date.now() } : book
      )
    );
  }


  function updateStatus(id, status) {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id ? { ...book, status, updatedAt: Date.now() } : book
      )
    );
  }


  function updateBook(updatedBook) {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === updatedBook.id ? { ...updatedBook, updatedAt: Date.now() } : book
      )
    );
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }



  function Page({ children }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path="/" element={ <LibraryPage 
            books={processedBooks} 
            deleteBook={deleteBook} 
            updateRating={updateRating} 
            updateStatus={updateStatus} 
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalBooks={books.length}
          /> }
          />
          <Route path="/add" element={<AddBookPage addBook={addBook} />} />
          <Route path="/edit/:id" element={<EditBookPage books={books} updateBook={updateBook} />} />
          <Route path="/book/:id" element={<BookDetailPage books={books} deleteBook={deleteBook} />} />

        </Routes>
      </AnimatePresence>

      <Toast message={toast} />

      <Footer />
    </div>
  );
}
