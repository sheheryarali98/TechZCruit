import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllOngoingProjectsForCurrentUser } from '../../../actions/testing/project';
import OngoingProjectItem from './OngoingProjectItem';
import styles from '../../../css/testing/ongoing-projects/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';

const OngoingProjects = ({
  project: { loading, projects },
  getAllOngoingProjectsForCurrentUser,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  useEffect(() => {
    getAllOngoingProjectsForCurrentUser();

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [getAllOngoingProjectsForCurrentUser, toggleSideNav]);

  return (
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
            <i className='fas fa-user'></i> Ongoing projects
          </div>
          <p className={styles.sub_heading}>
            Below is a list of all the projects you have undertaken
          </p>
          {!loading && projects.length > 0 ? (
            projects.map((project) => (
              <OngoingProjectItem
                key={project._id}
                project={project}
                styles={styles}
              />
            ))
          ) : (
            <div className={styles.sub_heading}>No projects found</div>
          )}
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

OngoingProjects.propTypes = {
  project: PropTypes.object.isRequired,
  getAllOngoingProjectsForCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllOngoingProjectsForCurrentUser,
  toggleSideNav,
})(windowSize(OngoingProjects));
