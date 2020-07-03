import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  getAllProductsForStore,
  deleteProduct,
} from '../../../actions/ecommerce/product';
import styles from '../../../css/ecommerce/store-products/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';

const StoreProducts = ({
  product: { loading, products },
  getAllProductsForStore,
  match,
  deleteProduct,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [
    getAllProductsForStoreCalled,
    setGetAllProductsForStoreCalled,
  ] = useState(false);

  useEffect(() => {
    if (!getAllProductsForStoreCalled) {
      getAllProductsForStore(match.params.id);
      setGetAllProductsForStoreCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [products, windowWidth]);

  const getCategory = (category) => {
    switch (category) {
      case 1:
        return 'Web';
      case 2:
        return 'Desktop';
      case 3:
        return 'Android';
      case 4:
        return 'IOS';
      case 5:
        return 'React Native';
      case 6:
        return 'Flutter';
      case 7:
        return 'Ionic';
      case 8:
        return 'Cross Platform';
      default:
        return 'Other';
    }
  };

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
            <i className='fas fa-user'></i> Store products
          </div>
          <div className={styles.sub_heading}>
            Below is a list of all the products in the store
          </div>
          <Button
            variant='primary'
            className={`my-3 ${styles.btn_primary}`}
            href={`/ecommerce/store/products/${match.params.id}/create-product`}
          >
            <i className='fas fa-users'></i> Create new product
          </Button>

          {!loading && products.length > 0 ? (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr>
                    <td>{product.title}</td>
                    <td>{product.description}</td>
                    <td>{getCategory(product.category)}</td>
                    <td>${product.price}</td>
                    <td>{product.sales}</td>
                    <td>
                      <Button
                        variant='success'
                        className='m-1'
                        href={`/ecommerce/store/products/${match.params.id}/edit-product/${product._id}`}
                      >
                        Update
                      </Button>
                      <Button
                        variant='danger'
                        className='m-1'
                        onClick={() => deleteProduct(product._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className={styles.sub_heading}>No products found</div>
          )}
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

StoreProducts.propTypes = {
  getAllProductsForStore: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllProductsForStore,
  deleteProduct,
  toggleSideNav,
})(windowSize(StoreProducts));
