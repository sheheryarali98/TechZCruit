import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Modal, Button } from 'react-bootstrap';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { sendRequestForService } from '../../../actions/freelance/service';

const DefaultRequestForm = ({
  serviceId,
  sendRequestForService,
  toggleModal,
  stripe,
  elements,
  amount
}) => {
  const [formData, setFormData] = useState({
    description: ''
  });

  const { description } = formData;

  const cardElementStyle = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    const cardElement = elements.getElement('card');

    if (!cardElement._complete || description === '') {
      alert('Invlalid details entered');
    } else {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement('card')
      });

      if (error) throw error;

      sendRequestForService(serviceId, description, amount, paymentMethod.id);

      toggleModal();
    }
  };

  return (
    <Fragment>
      <Form onSubmit={e => onSubmit(e)}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Please enter card details below</Form.Label>
            <CardElement style={cardElementStyle} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Please enter description below</Form.Label>
            <Form.Control
              as='textarea'
              rows='5'
              name='description'
              value={description}
              onChange={e => onChange(e)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => toggleModal()}>
            Close
          </Button>
          <Button variant='success' type='submit'>
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Fragment>
  );
};

DefaultRequestForm.propTypes = {
  serviceId: PropTypes.string.isRequired,
  sendRequestForService: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  stripe: PropTypes.object.isRequired,
  elements: PropTypes.object.isRequired,
  amount: PropTypes.number.isRequired
};

export default connect(null, {
  sendRequestForService
})(injectStripe(DefaultRequestForm));
