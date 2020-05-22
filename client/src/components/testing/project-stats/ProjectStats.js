import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProjectById } from '../../../actions/testing/project';
import ProjectStatsNavigationTabs from './ProjectStatsNavigationTabs';
import styles from '../../../css/testing/project-stats/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';

const ProjectStats = ({
  project: { project },
  getProjectById,
  match,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  useEffect(() => {
    getProjectById(match.params.id);

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [getProjectById, match.params.id, toggleSideNav]);

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
            <i className='fas fa-user'></i> Project Statistics
          </div>
          <div className={styles.sub_heading}>
            Below are the statistics related to the current project
          </div>
          <ProjectStatsNavigationTabs project={project} styles={styles} />
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

ProjectStats.propTypes = {
  project: PropTypes.object.isRequired,
  getProjectById: PropTypes.func.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getProjectById,
  toggleSideNav,
})(windowSize(ProjectStats));
