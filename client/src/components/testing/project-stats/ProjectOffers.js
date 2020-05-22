import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  deleteOfferForProject,
  addTesterToProject,
} from '../../../actions/testing/project';
import { injectStripe } from 'react-stripe-elements';

const ProjectOffers = ({
  project: { _id, offers },
  deleteOfferForProject,
  addTesterToProject,
  styles,
  stripe,
}) => {
  return (
    <Fragment>
      {offers.map((offer) => (
        <Row className={styles.list_item}>
          <Col xs={12} md={3}>
            <Link to={`/profile/${offer.user._id}`}>
              <img src={offer.user.avatar} alt='' className='round-img' />
            </Link>
          </Col>
          <Col xs={12} md={9}>
            <h2>{offer.user.name}</h2>
            <div>
              <strong>Amount: </strong>${offer.amount}
            </div>
            <div className='my-2'>
              <Button
                variant='success'
                onClick={() => {
                  stripe.confirmCardPayment(offer.clientSecret, {
                    payment_method: offer.paymentMethodId,
                  });

                  addTesterToProject(_id, offer.user._id);
                  deleteOfferForProject(_id, offer._id);
                }}
              >
                Accept
              </Button>
              <Button
                variant='danger'
                onClick={() => deleteOfferForProject(_id, offer._id)}
              >
                Reject
              </Button>
            </div>
          </Col>
        </Row>
      ))}
    </Fragment>
  );
};

ProjectOffers.propTypes = {
  project: PropTypes.object.isRequired,
  deleteOfferForProject: PropTypes.func.isRequired,
  addTesterToProject: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  stripe: PropTypes.object.isRequired,
};

export default connect(null, {
  deleteOfferForProject,
  addTesterToProject,
})(injectStripe(ProjectOffers));
