import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getProfileById } from '../../actions/profile';
import styles from '../../css/profile/style.module.css';
import SideNav from '../layout/SideNav';
import Footer from '../layout/Footer';
import { Row } from 'react-bootstrap';
import { toggleSideNav } from '../../actions/auth';
import windowSize from 'react-window-size';

const Profile = ({
  match,
  getProfileById,
  profile: { loading, profile },
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [getProfileByIdCalled, setGetProfileByIdCalled] = useState(false);

  useEffect(() => {
    if (!getProfileByIdCalled) {
      getProfileById(match.params.id);
      setGetProfileByIdCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [profile, windowWidth]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : !loading && profile !== null ? (
        <Fragment>
          <section className={styles.section}>
            <SideNav styles={styles} />

            <div
              className={`${styles.content} ${
                !displaySideNav ? styles.side_nav_hidden : ''
              }`}
            >
              <ProfileTop profile={profile} styles={styles} />
              <ProfileAbout profile={profile} styles={styles} />
              <Row className='my-3'>
                <ProfileExperience
                  experiences={profile.experiences}
                  styles={styles}
                />
                <ProfileEducation
                  education={profile.education}
                  styles={styles}
                />
              </Row>
            </div>
          </section>

          <Footer styles={styles} />
        </Fragment>
      ) : (
        <Fragment>
          <section className={styles.section}>
            <SideNav styles={styles} />

            <div
              className={`${styles.content} ${
                !displaySideNav ? styles.side_nav_hidden : ''
              }`}
            >
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                <i className='fas fa-user' style={{ fontSize: '2rem' }}></i> No
                profile found for user
              </div>
            </div>
          </section>

          <Footer styles={styles} />
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getProfileById,
  toggleSideNav,
})(windowSize(Profile));
