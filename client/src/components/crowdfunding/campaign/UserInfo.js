import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

const UserInfo = ({ campaign, styles }) => {
  return (
    <Fragment>
      <div className='lead mb-3 mt-1'>Campaign owner</div>
      <Row>
        <Col xs={12} md={12} style={{ textAlign: 'center' }}>
          <img
            src={campaign !== null ? campaign.user.avatar : ''}
            alt=''
            style={{ width: '150px', height: '150px' }}
            className='round-img'
          />
          <h3 className={styles.sub_heading}>
            {campaign !== null ? campaign.user.name : ''}
          </h3>
        </Col>
      </Row>
    </Fragment>
  );
};

UserInfo.propTypes = {
  campaign: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default UserInfo;
