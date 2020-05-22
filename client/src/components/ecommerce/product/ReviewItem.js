import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { deleteReviewOnProduct } from '../../../actions/ecommerce/product';

const ReviewItem = ({
  review,
  auth,
  product,
  deleteReviewOnProduct,
  styles,
}) => {
  return (
    <Fragment>
      <Row className={styles.list_item}>
        <Col xs={12} md={12} lg={3}>
          <Link to={`/profile/${review.user._id}`}>
            <img src={review.user.avatar} alt='' className='round-img' />
            <div className={styles.user_name}>{review.user.name}</div>
          </Link>
        </Col>
        <Col xs={12} md={12} lg={9}>
          <div className={styles.rating_review}>
            <Form.Check
              type='radio'
              className={review.rating === 5 ? 'checked' : ''}
              inline
            >
              <Form.Check.Input name='rating' type='radio' />
              <Form.Check.Label>
                <i class='fas fa-star'></i>
              </Form.Check.Label>
            </Form.Check>

            <Form.Check
              type='radio'
              className={review.rating === 4 ? 'checked' : ''}
              inline
            >
              <Form.Check.Input name='rating' type='radio' />
              <Form.Check.Label>
                <i class='fas fa-star'></i>
              </Form.Check.Label>
            </Form.Check>

            <Form.Check
              type='radio'
              className={review.rating === 3 ? 'checked' : ''}
              inline
            >
              <Form.Check.Input name='rating' type='radio' />
              <Form.Check.Label>
                <i class='fas fa-star'></i>
              </Form.Check.Label>
            </Form.Check>

            <Form.Check
              type='radio'
              className={review.rating === 2 ? 'checked' : ''}
              inline
            >
              <Form.Check.Input name='rating' type='radio' />
              <Form.Check.Label>
                <i class='fas fa-star'></i>
              </Form.Check.Label>
            </Form.Check>

            <Form.Check
              type='radio'
              className={review.rating === 1 ? 'checked' : ''}
              inline
            >
              <Form.Check.Input name='rating' type='radio' />
              <Form.Check.Label>
                <i class='fas fa-star'></i>
              </Form.Check.Label>
            </Form.Check>
          </div>

          <div className='my-3'>{review.description}</div>
          <div>
            {auth.user !== null &&
              (auth.user._id === product.user._id ||
                auth.user._id === review.user._id) && (
                <Button
                  variant='danger'
                  onClick={() => deleteReviewOnProduct(product._id, review._id)}
                >
                  Delete review
                </Button>
              )}
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

ReviewItem.propTypes = {
  review: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  deleteReviewOnProduct: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default connect(null, {
  deleteReviewOnProduct,
})(ReviewItem);
