import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllPosts } from '../../../actions/community/post';
import PostForm from './PostForm';
import PostItem from './PostItem';

const Posts = ({
  getAllPosts,
  post: { loading, posts },
  auth,
  group,
  styles
}) => {
  useEffect(() => {
    getAllPosts(group._id);
  }, [getAllPosts, group._id]);

  return (
    <Fragment>
      <PostForm groupId={group._id} />
      {!loading && posts.length > 0 ? (
        posts.map(post => (
          <div key={post._id}>
            <PostItem post={post} auth={auth} styles={styles} />
          </div>
        ))
      ) : (
        <div className='lead my-3'>No posts found</div>
      )}
    </Fragment>
  );
};

Posts.propTypes = {
  getAllPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
};

export default connect(null, {
  getAllPosts
})(Posts);
