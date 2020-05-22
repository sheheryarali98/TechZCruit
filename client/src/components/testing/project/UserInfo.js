import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

const UserInfo = ({ project, styles }) => {
  return (
    <Fragment>
      <div className='lead mb-3 mt-1'>Project owner</div>
      <Row>
        <Col xs={12} md={12} style={{ textAlign: 'center' }}>
          <img
            src={project !== null ? project.user.avatar : ''}
            alt=''
            style={{ width: '150px', height: '150px' }}
            className='round-img'
          />
          <h3 className={styles.sub_heading}>
            {project !== null ? project.user.name : ''}
          </h3>
        </Col>
      </Row>
    </Fragment>
  );
};

UserInfo.propTypes = {
  project: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default UserInfo;
