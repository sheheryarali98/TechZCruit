import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reviewOnProduct } from '../../../actions/ecommerce/product';
import { Form, Button } from 'react-bootstrap';

const ReviewForm = ({ product: { _id }, reviewOnProduct, styles }) => {
  const [formData, setFormData] = useState({
    description: '',
    rating: ''
  });

  const { description, rating } = formData;

  const setRating = rating => {
    console.log('Rating: ', rating);
    setFormData({ ...formData, rating: rating });
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    reviewOnProduct(_id, formData);

    if (description !== '' && rating !== '') {
      setFormData({
        description: '',
        rating: ''
      });
    }
  };

  return (
    <Fragment>
      <Form className='mt-3' onSubmit={e => onSubmit(e)}>
        <Form.Group className={`${styles.rating} mb-3`}>
          <Form.Check
            type='radio'
            className={rating === 5 ? 'checked' : ''}
            inline
          >
            <Form.Check.Input
              name='rating'
              type='radio'
              checked={rating === 5}
            />
            <Form.Check.Label onClick={() => setRating(5)}>
              <i className='fas fa-star'></i>
            </Form.Check.Label>
          </Form.Check>

          <Form.Check
            type='radio'
            className={rating === 4 ? 'checked' : ''}
            inline
          >
            <Form.Check.Input
              name='rating'
              type='radio'
              checked={rating === 4}
            />
            <Form.Check.Label onClick={() => setRating(4)}>
              <i className='fas fa-star'></i>
            </Form.Check.Label>
          </Form.Check>

          <Form.Check
            type='radio'
            className={rating === 3 ? 'checked' : ''}
            inline
          >
            <Form.Check.Input
              name='rating'
              type='radio'
              checked={rating === 3}
            />
            <Form.Check.Label onClick={() => setRating(3)}>
              <i className='fas fa-star'></i>
            </Form.Check.Label>
          </Form.Check>

          <Form.Check
            type='radio'
            className={rating === 2 ? 'checked' : ''}
            inline
          >
            <Form.Check.Input
              name='rating'
              type='radio'
              checked={rating === 2}
            />
            <Form.Check.Label onClick={() => setRating(2)}>
              <i className='fas fa-star'></i>
            </Form.Check.Label>
          </Form.Check>

          <Form.Check
            type='radio'
            className={rating === 1 ? 'checked' : ''}
            inline
          >
            <Form.Check.Input
              name='rating'
              type='radio'
              checked={rating === 1}
            />
            <Form.Check.Label onClick={() => setRating(1)}>
              <i className='fas fa-star'></i>
            </Form.Check.Label>
          </Form.Check>
        </Form.Group>

        <Form.Group>
          <Form.Control
            as='textarea'
            rows='5'
            name='description'
            value={description}
            onChange={e => onChange(e)}
            placeholder='Create a new review'
          />
        </Form.Group>
        <Button variant='dark' type='submit'>
          Submit
        </Button>
      </Form>
    </Fragment>
  );
};

ReviewForm.propTypes = {
  product: PropTypes.object.isRequired,
  reviewOnProduct: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired
};

export default connect(null, {
  reviewOnProduct
})(ReviewForm);
