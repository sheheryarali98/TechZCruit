import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import ReviewForm from './ReviewForm';
import CommentItem from './CommentItem';

const ProductNavigationTabs = ({ product, auth, styles }) => {
  return (
    <Fragment>
      <Tab.Container defaultActiveKey='reviews'>
        <Row>
          <Col md={12}>
            <Nav justify variant='tabs'>
              <Nav.Item>
                <Nav.Link eventKey='description'>Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='reviews'>Reviews</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Tab.Content>
              <Tab.Pane eventKey='description'>
                <div className='mt-3'>
                  {product !== null && product.description}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey='reviews'>
                {product !== null && (
                  <ReviewForm product={product} styles={styles} />
                )}
                {product !== null && product.reviews.length > 0 ? (
                  product.reviews.map(comment => (
                    <CommentItem
                      comment={comment}
                      auth={auth}
                      product={product}
                      styles={styles}
                    />
                  ))
                ) : (
                  <div className={styles.sub_heading}>No reviews found</div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Fragment>
  );
};

ProductNavigationTabs.propTypes = {
  product: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
};

export default ProductNavigationTabs;
