import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ReviewForm({ onReviewSubmit }) {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5000/reviews", { 
      content, 
      rating, 
      book_id: id 
    })
      .then((response) => {
        onReviewSubmit(); 
        setContent("");
        setRating(5);
      })
      .catch((error) => console.log(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Submit a Review</h3>
      <label>Rating (1-5):</label>
      <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} required />
      
      <label>Review:</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
