import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { finishServiceForService } from '../../../actions/freelance/service';

const ServiceServices = ({
  service: { _id, services },
  finishServiceForService,
}) => {
  return (
    <Fragment>
      <Table striped hover responsive className='my-3'>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr>
              <td>{service.user.name}</td>
              <td>{service.description}</td>
              <td>{!service.status ? 'Open' : 'Closed'}</td>
              <td>
                {!service.status && (
                  <Button
                    variant='success'
                    onClick={() => finishServiceForService(_id, service._id)}
                  >
                    Finish
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  );
};

ServiceServices.propTypes = {
  service: PropTypes.object.isRequired,
  finishServiceForService: PropTypes.func.isRequired,
};

export default connect(null, {
  finishServiceForService,
})(ServiceServices);
