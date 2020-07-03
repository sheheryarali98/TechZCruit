import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  getProjectById,
  deleteTestcaseForProject,
} from '../../../actions/testing/project';
import styles from '../../../css/testing/project-testcases/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';

const ProjectTestcases = ({
  project: { loading, project },
  getProjectById,
  match,
  deleteTestcaseForProject,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [getProjectByIdCalled, setGetProjectByIdCalled] = useState(false);

  useEffect(() => {
    if (!getProjectByIdCalled) {
      getProjectById(match.params.id);
      setGetProjectByIdCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [project, windowWidth]);

  return loading ? (
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
            <i className='fas fa-user'></i> Project test cases
          </div>
          <div className={styles.sub_heading}>
            Below is a list of all the testcases to be checked for the project
          </div>
          <Button
            variant='primary'
            className={`my-3 ${styles.btn_primary}`}
            href={`/testing/project/testcases/${
              !loading && project !== null ? project._id : ''
            }/create-testcase`}
          >
            <i className='fas fa-users'></i> Create new test case
          </Button>

          {!loading && project !== null && project.testCases.length > 0 ? (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Expected result</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {project.testCases.map((testcase) => (
                  <tr>
                    <td>{testcase.name}</td>
                    <td>{testcase.description}</td>
                    <td>{testcase.expectedResult}</td>
                    <td>
                      <Button
                        variant='danger'
                        onClick={() =>
                          deleteTestcaseForProject(project._id, testcase._id)
                        }
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className={styles.sub_heading}>No testcases found</div>
          )}
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

ProjectTestcases.propTypes = {
  project: PropTypes.object.isRequired,
  getProjectById: PropTypes.func.isRequired,
  deleteTestcaseForProject: PropTypes.func.isRequired,
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
  deleteTestcaseForProject,
  toggleSideNav,
})(windowSize(ProjectTestcases));
