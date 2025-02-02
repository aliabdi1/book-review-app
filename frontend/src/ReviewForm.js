import React from "react";
import axios from "axios";
import { Button, Alert } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  rating: Yup.number()
    .min(1, "Rating must be between 1-5")
    .max(5, "Rating must be between 1-5")
    .required("Required"),
  content: Yup.string().required("Review content is required")
});

const ReviewForm = ({ bookId, onReviewSubmit }) => {
  return (
    <Formik
      initialValues={{ rating: 1, content: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        axios.post('http://localhost:5003/reviews', {
          ...values,
          book_id: bookId,
          user_id: 1 // Replace with actual user ID
        })
        .then(() => {
          onReviewSubmit();
          resetForm();
        })
        .catch(error => console.error(error));
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mb-4">
          <h3>Submit a Review</h3>
          
          <div className="mb-3">
            <label>Rating</label>
            <Field 
              as="select" 
              name="rating" 
              className="form-select"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </Field>
            <ErrorMessage name="rating" component={Alert} variant="danger" />
          </div>

          <div className="mb-3">
            <label>Review</label>
            <Field 
              as="textarea" 
              name="content" 
              className="form-control" 
              rows="4"
            />
            <ErrorMessage name="content" component={Alert} variant="danger" />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            Submit Review
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ReviewForm;