import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import styles from '../../css/dashboard/style.module.css';
import { Button } from 'react-bootstrap';
import Footer from '../layout/Footer';
import Alert from '../layout/Alert';
import SideNav from '../layout/SideNav';
import { toggleSideNav } from '../../actions/auth';
import windowSize from 'react-window-size';

const Dashboard = ({
  auth: { user, displaySideNav },
  getCurrentProfile,
  deleteProfile,
  profile: { profile, loading },
  toggleSideNav,
  windowWidth,
}) => {
  useEffect(() => {
    getCurrentProfile();
    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [getCurrentProfile, toggleSideNav]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <section className={styles.section}>
        <SideNav styles={styles} />

        <div
          className={`${styles.content} ${
            !displaySideNav ? styles.side_nav_hidden : ''
          }`}
        >
          <Alert />
          <div className={styles.heading}>
            <i className='fas fa-user'></i> Dashboard
          </div>
          <div className={styles.sub_heading}>Welcome {user && user.name}</div>

          {profile !== null ? (
            <Fragment>
              <DashboardActions styles={styles} />
              <Experience styles={styles} experiences={profile.experiences} />
              <Education styles={styles} education={profile.education} />
              <Button
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to delete your profile? You cannot undo this action'
                    )
                  ) {
                    deleteProfile();
                  }
                }}
                variant='danger'
                className='my-2'
              >
                <i className='fas fa-user'></i> Delete my account
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <p className='my-2'>
                You have not yet setup a profile, please add some info
              </p>
              <Button
                href='/create-profile'
                variant='primary'
                className={styles.btn_primary}
              >
                Create your profile
              </Button>{' '}
            </Fragment>
          )}
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  deleteProfile,
  toggleSideNav,
})(windowSize(Dashboard));
