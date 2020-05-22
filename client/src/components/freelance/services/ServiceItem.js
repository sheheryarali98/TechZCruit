import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import placeholder from '../../../img/placeholder.png';

const ServiceItem = ({
  service: { _id, title, description, amount },
  styles,
}) => {
  return (
    <Fragment>
      <Col xs={12} md={4} lg={3}>
        <Card className={styles.card}>
          <Card.Img variant='top' src={placeholder} />
          <Card.Body>
            <Card.Title className={`${styles.card_title} text-truncate`}>
              <Link
                to={`/freelance/service/${_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {title}
              </Link>
            </Card.Title>
            <Card.Text>
              <div className='text-truncate'>{description}</div>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <div className='text-truncate'>
              <strong>Amount: </strong>${amount}
            </div>
          </Card.Footer>
        </Card>
      </Col>
    </Fragment>
  );
};

ServiceItem.propTypes = {
  service: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ServiceItem;
