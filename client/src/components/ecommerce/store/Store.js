import React, { Fragment, useEffect, useState } from 'react';
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
import Spinner from '../../layout/Spinner';

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
  const [functionsCallled, setFunctionsCallled] = useState(false);

  useEffect(() => {
    if (!functionsCallled) {
      getStoreById(match.params.id);
      getAllProductsForStore(match.params.id);
      setFunctionsCallled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [store, windowWidth]);

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
