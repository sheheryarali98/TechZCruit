import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  deleteRequestForService,
  addServiceToService,
} from '../../../actions/freelance/service';
import { injectStripe } from 'react-stripe-elements';

const ServiceRequests = ({
  service: { _id, requests },
  deleteRequestForService,
  addServiceToService,
  styles,
  stripe,
}) => {
  return (
    <Fragment>
      {requests.map((request) => (
        <Row className={styles.list_item}>
          <Col xs={12} md={3}>
            <Link to={`/profile/${request.user._id}`}>
              <img src={request.user.avatar} alt='' className='round-img' />
            </Link>
          </Col>
          <Col xs={12} md={9}>
            <h2>{request.user.name}</h2>
            <div className='mb-2'>{request.description}</div>
            <div>
              <strong>Amount: </strong>${request.amount}
            </div>
            <div className='my-2'>
              <Button
                variant='success'
                onClick={() => {
                  stripe.confirmCardPayment(request.clientSecret, {
                    payment_method: request.paymentMethodId,
                  });

                  addServiceToService(_id, request._id);
                  deleteRequestForService(_id, request._id);
                }}
              >
                Accept
              </Button>
              <Button
                variant='danger'
                onClick={() => deleteRequestForService(_id, request._id)}
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

ServiceRequests.propTypes = {
  service: PropTypes.object.isRequired,
  deleteRequestForService: PropTypes.func.isRequired,
  addServiceToService: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  stripe: PropTypes.object.isRequired,
};

export default connect(null, {
  deleteRequestForService,
  addServiceToService,
})(injectStripe(ServiceRequests));
