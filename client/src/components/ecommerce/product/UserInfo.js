import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

const UserInfo = ({ product, styles }) => {
  return (
    <Fragment>
      <div className='lead mb-3 mt-1'>Product owner</div>
      <Row>
        <Col xs={12} md={12} style={{ textAlign: 'center' }}>
          <img
            src={product !== null ? product.user.avatar : ''}
            alt=''
            style={{ width: '150px', height: '150px' }}
            className='round-img'
          />
          <h3 className={styles.sub_heading}>
            {product !== null ? product.user.name : ''}
          </h3>
        </Col>
      </Row>
    </Fragment>
  );
};

UserInfo.propTypes = {
  product: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default UserInfo;
