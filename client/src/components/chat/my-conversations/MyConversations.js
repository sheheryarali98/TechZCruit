import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllConversationsForCurrentUser } from '../../../actions/chat/conversation';
import styles from '../../../css/chat/my-conversations/style.module.css';
import Footer from '../../layout/Footer';
import Alert from '../../layout/Alert';
import SideNav from '../../layout/SideNav';
import MyConversationItem from './MyConversationItem';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';

const MyConversations = ({
  conversation: { loading, conversations },
  getAllConversationsForCurrentUser,
  auth,
  toggleSideNav,
  windowWidth,
}) => {
  const [
    getAllConversationForCurrentUserCalled,
    setGetAllConversationForCurrentUserCalled,
  ] = useState(false);

  useEffect(() => {
    if (!getAllConversationForCurrentUserCalled) {
      getAllConversationsForCurrentUser();
      setGetAllConversationForCurrentUserCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [conversations, windowWidth]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <section className={styles.section}>
        <SideNav styles={styles} />

        <div
          className={`${styles.content} ${
            !auth.displaySideNav ? styles.side_nav_hidden : ''
          }`}
        >
          <Alert />
          <div className={styles.heading}>
            <i className='fas fa-user'></i> Chat
          </div>
          <div className={styles.sub_heading}>
            Below is a list of all your conversations
          </div>
          {!loading && auth.user !== null && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <MyConversationItem
                key={conversation._id}
                conversation={conversation}
                styles={styles}
                auth={auth}
              />
            ))
          ) : (
            <div className={styles.sub_heading}>No conversations found</div>
          )}
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

MyConversations.propTypes = {
  conversation: PropTypes.object.isRequired,
  getAllConversationsForCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  conversation: state.conversation,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllConversationsForCurrentUser,
  toggleSideNav,
})(windowSize(MyConversations));
