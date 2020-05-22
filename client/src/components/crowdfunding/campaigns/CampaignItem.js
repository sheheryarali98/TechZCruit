import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import placeholder from '../../../img/placeholder.png';

const CampaignItem = ({
  campaign: { _id, title, description, supporters, fundsRequired },
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
                to={`/crowdfunding/campaign/${_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {title}
              </Link>
            </Card.Title>
            <Card.Text className='text-truncate'>{description}</Card.Text>
          </Card.Body>
          <Card.Footer className='text-truncate'>
            <strong>Funds raised:</strong>{' '}
            {Math.round(
              (supporters
                .map((supporter) => supporter.amount)
                .reduce((a, b) => a + b, 0) /
                fundsRequired) *
                100
            )}
            {'%'}
          </Card.Footer>
        </Card>
      </Col>
    </Fragment>
  );
};

CampaignItem.propTypes = {
  campaign: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default CampaignItem;
