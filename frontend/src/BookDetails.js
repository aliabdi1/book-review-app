import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "./ReviewForm";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/books/${id}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.log(error));

    axios.get(`http://127.0.0.1:5000/reviews/${id}`)
      .then((response) => setReviews(response.data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!book) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p><strong>Author:</strong> {book.author}</p>
      <p>{book.description}</p>

      <h2>Reviews:</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>Rating:</strong> {review.rating}/5 <br />
              {review.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookDetails;
