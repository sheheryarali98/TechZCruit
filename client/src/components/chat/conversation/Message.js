import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Message = ({ message: { user, description }, styles, auth }) => {
  return (
    <Fragment>
      <div
        className={styles.message}
        style={{ float: user._id === auth.user._id ? 'right' : 'left' }}
      >
        <img src={user.avatar} className='round-img' alt='' />
        <div>
          <div>{user.name}</div>
          <div>{description}</div>
        </div>
      </div>
    </Fragment>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

export default Message;
