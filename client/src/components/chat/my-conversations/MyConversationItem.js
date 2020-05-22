import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const MyConversationItem = ({ conversation: { _id, users }, styles, auth }) => {
  return (
    <Fragment>
      <Row className={styles.list_item}>
        <Col xs={12} md={3}>
          <Link
            to={`/profile/${
              users.filter((item) => item.user._id !== auth.user._id)[0].user
                ._id
            }`}
          >
            <img
              src={
                users.filter((item) => item.user._id !== auth.user._id)[0].user
                  .avatar
              }
              alt=''
              className='round-img'
            />
          </Link>
        </Col>
        <Col xs={12} md={9}>
          <h2>
            {
              users.filter((item) => item.user._id !== auth.user._id)[0].user
                .name
            }
          </h2>
          <div>
            <Button
              variant='dark'
              href={`/conversation/${_id}`}
              style={{ color: 'white' }}
            >
              Go to chat
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

MyConversationItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default MyConversationItem;
