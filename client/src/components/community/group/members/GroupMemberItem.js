import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { removeMemberFromGroup } from '../../../../actions/community/group';
import { createConversation } from '../../../../actions/chat/conversation';
import { Row, Col } from 'react-bootstrap';

const GroupMemberItem = ({
  member,
  isAdmin,
  auth,
  group,
  removeMemberFromGroup,
  styles,
  createConversation,
  history,
}) => {
  const redirectToChat = async () => {
    const conversationId = await createConversation(
      auth.user._id,
      group.admin._id
    );

    history.push(`/conversation/${conversationId}`);
  };

  return (
    <Fragment>
      <Row className={styles.list_item}>
        <Col xs={12} md={3}>
          <Link to={`/profile/${member._id}`}>
            <img src={member.avatar} alt='' className='round-img' />
          </Link>
        </Col>
        <Col xs={12} md={9}>
          <h2>{member.name}</h2>
          <div>
            {isAdmin && (
              <Fragment>
                <h5>Admin</h5>
                {auth.user !== null &&
                  group !== null &&
                  group.admin._id !== auth.user._id && (
                    <Button variant='dark' onClick={() => redirectToChat()}>
                      Chat with admin
                    </Button>
                  )}
              </Fragment>
            )}
            {auth.user !== null &&
              !isAdmin &&
              auth.user._id === group.admin._id && (
                <Button
                  variant='danger'
                  className='my-2'
                  onClick={() => removeMemberFromGroup(group._id, member._id)}
                >
                  Remove member
                </Button>
              )}
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

GroupMemberItem.propTypes = {
  member: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  removeMemberFromGroup: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  createConversation: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, {
  removeMemberFromGroup,
  createConversation,
})(withRouter(GroupMemberItem));
