import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getAllServicesForCurrentUser } from '../../../actions/freelance/service';
import MyServiceItem from './MyServiceItem';
import styles from '../../../css/freelance/my-services/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';

const MyServices = ({
  service: { loading, services },
  getAllServicesForCurrentUser,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [
    getAllServicesForCurrentUserCalled,
    setGetAllServicesForCurrentUserCalled,
  ] = useState(false);

  useEffect(() => {
    if (!getAllServicesForCurrentUserCalled) {
      getAllServicesForCurrentUser();
      setGetAllServicesForCurrentUserCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [services, windowWidth]);

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
            <i className='fas fa-user'></i> My Services
          </div>
          <div className={styles.sub_heading}>
            Below is a list of all the services you have created
          </div>
          <Button
            variant='primary'
            className={`my-2 ${styles.btn_primary}`}
            href='/freelance/create-service'
          >
            <i className='fas fa-users'></i> Create new service
          </Button>
          {!loading && services.length > 0 ? (
            services.map((service) => (
              <MyServiceItem
                key={service._id}
                service={service}
                styles={styles}
              />
            ))
          ) : (
            <div className={styles.sub_heading}>No services found</div>
          )}
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

MyServices.propTypes = {
  service: PropTypes.object.isRequired,
  getAllServicesForCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  service: state.service,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllServicesForCurrentUser,
  toggleSideNav,
})(windowSize(MyServices));
