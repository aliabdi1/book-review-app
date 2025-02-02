// src/components/Reviews.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch the list of reviews from the API
    axios.get('http://127.0.0.1:5003/reviews')
      .then(response => setReviews(response.data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, []);

  return (
    <div>
      <h1>All Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <ul>
          {reviews.map(review => (
            <li key={review.id}>
              <strong>Rating:</strong> {review.rating}/5 <br />
              <strong>Review:</strong> {review.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Reviews;