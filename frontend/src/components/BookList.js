import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5003/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Container className="py-5 bg-light">
      <h1 className="text-center mb-4 text-primary">📚 Our Library Collection</h1>
      <Row>
        {books.map((book) => (
          <Col xl={3} lg={4} md={6} className="mb-4" key={book.id}>
            <Card className="shadow-lg h-100">
              <Card.Header className="bg-primary text-white">
                <Card.Title className="mb-0">{book.title}</Card.Title>
                <Card.Subtitle className="mt-1">
                  by {book.author || "Unknown Author"}
                </Card.Subtitle>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <div className="mb-3">
                  <div 
                    className="bg-secondary text-white text-center py-4 mb-3"
                    style={{ height: '200px', backgroundColor: '#e9ecef' }}
                  >
                    {book.cover_image ? (
                      <img 
                        src={book.cover_image} 
                        alt={book.title} 
                        className="img-fluid h-100"
                      />
                    ) : (
                      <span className="text-muted">Cover Image Preview</span>
                    )}
                  </div>
                  
                  <Card.Text className="text-muted small mb-2">
                    <strong>Published:</strong> {book.published_date || 'N/A'}<br />
                    <strong>Pages:</strong> {book.pages || 'N/A'}<br />
                    <strong>Genre:</strong> {book.genre || 'General'}
                  </Card.Text>

                  <Card.Text className="mb-3">
                    {book.description?.substring(0, 90) || 'No description available'}...
                  </Card.Text>
                </div>

                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Badge bg="success" className="fs-6">
                      ⭐ {book.average_rating?.toFixed(1) || '0.0'}/5
                    </Badge>
                    {new Date(book.published_date) > new Date(Date.now() - 30*24*60*60*1000) && (
                      <Badge bg="danger">New</Badge>
                    )}
                  </div>
                  <Link to={`/books/${book.id}`} className="d-block">
                    <Button 
                      variant="outline-primary" 
                      className="w-100 shadow-sm"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default BookList;