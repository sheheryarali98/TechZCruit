import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteComment } from '../../../actions/community/post';
import { Row, Col } from 'react-bootstrap';

const CommentItem = ({ comment, auth, deleteComment, post, styles }) => {
  return (
    <Fragment>
      <Row className={styles.list_item}>
        <Col xs={12} md={3}>
          <Link to={`/profile/${comment.user._id}`}>
            <img src={comment.user.avatar} alt='' className='round-img' />
            <div className={styles.user_name}>{comment.user.name}</div>
          </Link>
        </Col>
        <Col xs={12} md={9}>
          <p>{comment.description}</p>
          <div className='my-1'>
            {auth.user !== null &&
              (auth.user._id === comment.user._id ||
                auth.user._id === post.group.admin) && (
                <button
                  className='btn btn-danger'
                  onClick={() => deleteComment(post._id, comment._id)}
                >
                  Delete comment
                </button>
              )}
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default connect(null, {
  deleteComment,
})(CommentItem);
