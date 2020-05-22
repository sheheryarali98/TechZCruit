import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const DashboardActions = ({ styles }) => {
  return (
    <Fragment>
      <div className={styles.dash_buttons}>
        <Link
          to='/edit-profile'
          className={`btn btn-primary ${styles.btn_primary}`}
        >
          <i className='fas fa-user-circle'></i> Edit Profile
        </Link>
        <Link
          to='/add-experience'
          className={`btn btn-primary ${styles.btn_primary}`}
        >
          <i className='fab fa-black-tie'></i> Add Experience
        </Link>
        <Link
          to='/add-education'
          className={`btn btn-primary ${styles.btn_primary}`}
        >
          <i className='fas fa-book'></i> Add Education
        </Link>
      </div>
    </Fragment>
  );
};

DashboardActions.propTypes = {
  styles: PropTypes.object.isRequired,
};

export default DashboardActions;
