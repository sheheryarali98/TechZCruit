import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  deleteJoinRequest,
  addMemberToGroup,
} from '../../../../actions/community/group';
import { Row, Col } from 'react-bootstrap';

const GroupRequestItem = ({
  request: { _id, user },
  deleteJoinRequest,
  groupId,
  addMemberToGroup,
  styles,
}) => {
  return (
    <Fragment>
      <Row className={styles.list_item}>
        <Col xs={12} md={3}>
          <Link to={`/profile/${user._id}`}>
            <img src={user.avatar} alt='' className='round-img' />
          </Link>
        </Col>
        <Col xs={12} md={9}>
          <h2>{user.name}</h2>
          <div>
            <Button
              variant='success'
              className='my-2'
              onClick={() => {
                addMemberToGroup(groupId, user._id);
                deleteJoinRequest(groupId, _id);
              }}
            >
              Accept Request
            </Button>
            <Button
              variant='danger'
              className='my-2'
              onClick={() => deleteJoinRequest(groupId, _id)}
            >
              Delete request
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

GroupRequestItem.propTypes = {
  request: PropTypes.object.isRequired,
  deleteJoinRequest: PropTypes.func.isRequired,
  groupId: PropTypes.string.isRequired,
  addMemberToGroup: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default connect(null, {
  deleteJoinRequest,
  addMemberToGroup,
})(GroupRequestItem);
