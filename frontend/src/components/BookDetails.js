import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "../ReviewForm";
import { Container, Card, ListGroup, Badge, Row, Col } from "react-bootstrap";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  // ✅ Correctly placed fetchReviews function
  const fetchReviews = useCallback(() => {
    axios.get(`http://127.0.0.1:5003/reviews/${id}`)
      .then((response) => setReviews(response.data))
      .catch((error) => console.log(error));
  }, [id]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5003/books/${id}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.log(error));

    fetchReviews();
  }, [id, fetchReviews]);

  if (!book) return <h2 className="text-center my-5">Loading...</h2>;
  return (
    <Container className="py-5 bg-light">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-1">{book.title}</h2>
          <h4 className="mb-0">by {book.author}</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Card.Text className="text-muted">
                <strong>Published:</strong> {book.published_date || "N/A"}<br />
                <strong>Pages:</strong> {book.pages || "N/A"}<br />
                <strong>Genre:</strong> {book.genre || "General"}
              </Card.Text>
            </Col>
            <Col md={6} className="text-md-end">
              <Badge bg="success" className="fs-5">
                Average Rating: {book.average_rating?.toFixed(1) || '0.0'}/5
              </Badge>
            </Col>
          </Row>
          <Card.Text>{book.description}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-info text-white">
          <h3 className="mb-0">Write a Review</h3>
        </Card.Header>
        <Card.Body>
          <ReviewForm bookId={id} onReviewSubmit={fetchReviews} />
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header className="bg-secondary text-white">
          <h3 className="mb-0">Reader Reviews</h3>
        </Card.Header>
        <Card.Body>
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first to share your thoughts!</p>
          ) : (
            <ListGroup variant="flush">
              {reviews.map((review) => (
                <ListGroup.Item key={review.id} className="py-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="warning" text="dark" className="fs-6">
                      {review.rating}/5 Stars
                    </Badge>
                    <small className="text-muted">
                      {new Date(review.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-0">{review.content}</p>
                  {review.user && (
                    <small className="text-muted mt-1 d-block">
                      - {review.user.username}
                    </small>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BookDetails;