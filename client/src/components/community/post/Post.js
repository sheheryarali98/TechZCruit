import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPostById } from '../../../actions/community/post';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { Row, Col } from 'react-bootstrap';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import styles from '../../../css/community/group/style.module.css';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';

const Post = ({
  post: { post, loading },
  getPostById,
  match,
  auth,
  toggleSideNav,
  windowWidth,
}) => {
  const [getPostByIdCalled, setGetPostByIdCalled] = useState(false);

  useEffect(() => {
    if (!getPostByIdCalled) {
      getPostById(match.params.id);
      setGetPostByIdCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [post, windowWidth]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      {!loading && post !== null && (
        <Fragment>
          <section className={styles.section}>
            <SideNav styles={styles} />

            <div
              className={`${styles.content} ${
                !auth.displaySideNav ? styles.side_nav_hidden : ''
              }`}
            >
              <Alert />
              <Row className={styles.list_item}>
                <Col xs={12} md={3}>
                  <Link to={`/profile/${post.user._id}`}>
                    <img src={post.user.avatar} alt='' className='round-img' />
                    <div className={styles.user_name}>{post.user.name}</div>
                  </Link>
                </Col>
                <Col xs={12} md={9}>
                  {post.description}
                </Col>
              </Row>
              <CommentForm post={post} />
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment._id}>
                    <CommentItem
                      comment={comment}
                      auth={auth}
                      post={post}
                      styles={styles}
                    />
                  </div>
                ))
              ) : (
                <div className={styles.sub_heading}>No comments found</div>
              )}
            </div>
          </section>

          <Footer styles={styles} />
        </Fragment>
      )}
    </Fragment>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  getPostById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPostById,
  toggleSideNav,
})(windowSize(Post));
