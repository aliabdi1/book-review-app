// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch the list of books from the API
    axios.get('http://127.0.0.1:5003/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <div>
      <h1>All Books</h1>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <ul>
          {books.map(book => (
            <li key={book.id}>
              <h2>{book.title}</h2>
              <p>{book.description}</p>
              <Link to={`/books/${book.id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;