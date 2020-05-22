import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  deletePost,
  likePost,
  unlikePost,
} from '../../../actions/community/post';
import { Row, Col, Button } from 'react-bootstrap';

const PostItem = ({
  post: { _id, user, description, likes },
  auth,
  deletePost,
  likePost,
  unlikePost,
  styles,
}) => {
  return (
    <Fragment>
      <Row className={styles.list_item}>
        <Col xs={12} md={3}>
          <Link to={`/profile/${user._id}`}>
            <img src={user.avatar} alt='' className='round-img' />
            <div className={styles.user_name}>{user.name}</div>
          </Link>
        </Col>
        <Col xs={12} md={9}>
          <div className='text-truncate'>{description}</div>
          <div className='my-3'>
            <Button variant='dark' onClick={() => likePost(_id)}>
              <i className='fas fa-thumbs-up'></i>{' '}
              <span>{likes.length > 0 ? likes.length : ''}</span>
            </Button>
            <Button variant='dark' onClick={() => unlikePost(_id)}>
              <i className='fas fa-thumbs-down'></i>
            </Button>
            <Button variant='dark' href={`/community/post/${_id}`}>
              View Post
            </Button>
            {auth.user._id === user._id && (
              <Button variant='danger' onClick={() => deletePost(_id)}>
                Delete post
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default connect(null, {
  deletePost,
  likePost,
  unlikePost,
})(PostItem);
