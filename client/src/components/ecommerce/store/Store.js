import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { getAllProductsForStore } from '../../../actions/ecommerce/product';
import { getStoreById } from '../../../actions/ecommerce/store';
import PropTypes from 'prop-types';
import styles from '../../../css/ecommerce/store/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import StoreNavigationTabs from './StoreNavigationTabs';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';

const Store = ({
  getAllProductsForStore,
  getStoreById,
  product,
  store: { loading, store },
  match,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  useEffect(() => {
    getStoreById(match.params.id);
    getAllProductsForStore(match.params.id);

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [getAllProductsForStore, getStoreById, match.params.id, toggleSideNav]);

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
            {!loading && store !== null && store.name}
          </div>
          <div className='mt-2'>
            <StoreNavigationTabs
              store={store}
              product={product}
              styles={styles}
            />
          </div>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Store.propTypes = {
  product: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  getAllProductsForStore: PropTypes.func.isRequired,
  getStoreById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product,
  store: state.store,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllProductsForStore,
  getStoreById,
  toggleSideNav,
})(windowSize(Store));
