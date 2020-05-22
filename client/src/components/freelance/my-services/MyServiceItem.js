import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteService } from '../../../actions/freelance/service';

const MyServiceItem = ({
  service: { _id, title, description },
  deleteService,
  styles
}) => {
  return (
    <Fragment>
      <Row className={styles.list_item}>
        <Col md={12}>
          <Link to={`/freelance/service/${_id}`} className={styles.group_name}>
            {title}
          </Link>
          <div className='mt-2'>{description}</div>
          <div className='mt-2'>
            <Button variant='dark' href={`/freelance/service/stats/${_id}`}>
              View stats
            </Button>
            <Button variant='success' href={`/freelance/edit-service/${_id}`}>
              Update service
            </Button>
            <Button variant='danger' onClick={() => deleteService(_id)}>
              Delete service
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

MyServiceItem.propTypes = {
  service: PropTypes.object.isRequired,
  deleteService: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired
};

export default connect(null, {
  deleteService
})(MyServiceItem);
