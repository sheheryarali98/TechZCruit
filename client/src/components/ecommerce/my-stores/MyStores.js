import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyStoreItem from './MyStoreItem';
import { Button } from 'react-bootstrap';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import styles from '../../../css/ecommerce/my-stores/style.module.css';
import { getAllStoresForCurrentUser } from '../../../actions/ecommerce/store';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';

const MyStores = ({
  store: { loading, stores },
  getAllStoresForCurrentUser,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [
    getAllStoresForCurrentUserCalled,
    setGetAllStoresForCurrentUserCalled,
  ] = useState(false);

  useEffect(() => {
    if (!getAllStoresForCurrentUserCalled) {
      getAllStoresForCurrentUser();
      setGetAllStoresForCurrentUserCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [stores, windowWidth]);

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
          <h1 className={styles.heading}>
            <i className='fas fa-user'></i> My Stores
          </h1>
          <div className={styles.sub_heading}>
            Below is a list of all the stores you have created
          </div>
          <Button
            variant='primary'
            className={styles.btn_primary}
            href='/ecommerce/create-store'
          >
            <i className='fas fa-users'></i> Create new store
          </Button>
          {!loading && stores.length > 0 ? (
            stores.map((store) => (
              <MyStoreItem key={store._id} store={store} styles={styles} />
            ))
          ) : (
            <div className={styles.sub_heading}>No stores found</div>
          )}
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

MyStores.propTypes = {
  getAllStoresForCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  store: state.store,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllStoresForCurrentUser,
  toggleSideNav,
})(windowSize(MyStores));
