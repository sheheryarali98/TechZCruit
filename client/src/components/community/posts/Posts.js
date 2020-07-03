import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllPosts } from '../../../actions/community/post';
import PostForm from './PostForm';
import PostItem from './PostItem';
import Spinner from '../../layout/Spinner';

const Posts = ({
  getAllPosts,
  post: { loading, posts },
  auth,
  group,
  styles,
}) => {
  const [getAllPostsCalled, setGetAllPostsCalled] = useState(false);

  useEffect(() => {
    if (!getAllPostsCalled) {
      getAllPosts(group._id);
      setGetAllPostsCalled(true);
    }
    // eslint-disable-next-line
  }, [posts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <PostForm groupId={group._id} />
      {!loading && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id}>
            <PostItem post={post} auth={auth} styles={styles} />
          </div>
        ))
      ) : (
        <div className={styles.sub_heading}>No posts found</div>
      )}
    </Fragment>
  );
};

Posts.propTypes = {
  getAllPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default connect(null, {
  getAllPosts,
})(Posts);
