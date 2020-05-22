import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const SideNav = ({ styles, auth: { loading, user, displaySideNav } }) => {
  return (
    <Fragment>
      <div
        className={`${styles.side_nav} ${!displaySideNav ? styles.hidden : ''}`}
      >
        <div className={styles.side_nav_heading}>User Management</div>
        <Link to='/dashboard'>Dashboard</Link>
        <Link to={!loading && user !== null ? `/profile/${user._id}` : ''}>
          My Profile
        </Link>
        <Link to='/settings'>Settings</Link>

        <div className={styles.side_nav_heading}>Community</div>
        <Link to='/community'>All groups</Link>
        <Link to='/community/my-groups'>My groups</Link>

        <div className={styles.side_nav_heading}>Crowdfunding</div>
        <Link to='/crowdfunding'>All campaigns</Link>
        <Link to='/crowdfunding/my-campaigns'>My campaigns</Link>

        <div className={styles.side_nav_heading}>Testing</div>
        <Link to='/testing'>Homepage</Link>
        <Link to='/testing/ongoing-projects'>Ongoing projects</Link>
        <Link to='/testing/my-projects'>My projects</Link>

        <div className={styles.side_nav_heading}>E-commerce</div>
        <Link to='/ecommerce'>All products</Link>
        <Link to='/ecommerce/stores'>All stores</Link>
        <Link to='/ecommerce/my-stores'>My stores</Link>

        <div className={styles.side_nav_heading}>Freelance</div>
        <Link to='/freelance'>Homepage</Link>
        <Link to='/freelance/my-services'>My services</Link>
      </div>
    </Fragment>
  );
};

SideNav.propTypes = {
  styles: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(SideNav);
