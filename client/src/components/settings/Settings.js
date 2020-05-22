import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProfilePicture from './ProfilePicture';
import Name from './Name';
import ChangePassword from './ChangePassword';
import { connect } from 'react-redux';
import styles from '../../css/settings/style.module.css';
import SideNav from '../layout/SideNav';
import Alert from '../layout/Alert';
import Footer from '../layout/Footer';
import { toggleSideNav } from '../../actions/auth';
import windowSize from 'react-window-size';

const Settings = ({ auth, toggleSideNav, windowWidth }) => {
  useEffect(() => {
    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [toggleSideNav]);

  return (
    <Fragment>
      <section>
        <SideNav styles={styles} />

        <div
          className={`${styles.content} ${
            !auth.displaySideNav ? styles.side_nav_hidden : ''
          }`}
        >
          <Alert />
          <div className={styles.heading}>
            <i className='fas fa-user'></i> Settings
          </div>
          <ProfilePicture auth={auth} styles={styles} />
          <Name styles={styles} />
          <ChangePassword styles={styles} />
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Settings.propTypes = {
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  toggleSideNav,
})(windowSize(Settings));
