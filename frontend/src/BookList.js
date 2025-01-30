import React, { useEffect, useState } from "react";
import axios from "axios";

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h1>Book List</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title} by {book.author}</li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
