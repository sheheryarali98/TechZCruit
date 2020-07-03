import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StoreItem = ({ store: { _id, name, description, image }, styles }) => {
  return (
    <Fragment>
      <Col xs={12} md={4} lg={3}>
        <Card className={styles.card}>
          <Card.Img variant='top' src={image} />
          <Card.Body>
            <Card.Title className={`${styles.card_title} text-truncate`}>
              <Link
                to={`/ecommerce/store/${_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {name}
              </Link>
            </Card.Title>
            <Card.Text className='text-truncate'>{description}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Fragment>
  );
};

StoreItem.propTypes = {
  store: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default StoreItem;
