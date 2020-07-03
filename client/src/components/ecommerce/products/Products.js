import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  getAllProducts,
  searchProduct,
} from '../../../actions/ecommerce/product';
import ProductItem from './ProductItem';
import styles from '../../../css/ecommerce/products/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';

const Products = ({
  getAllProducts,
  product: { loading, products },
  searchProduct,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [getAllProductsCalled, setGetAllProductsCalled] = useState(false);

  useEffect(() => {
    if (!getAllProductsCalled) {
      getAllProducts();
      setGetAllProductsCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [products, windowWidth]);

  const [formData, setFormData] = useState({
    description: '',
  });

  const { description } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (description === '') {
      getAllProducts();
    } else {
      searchProduct(description);
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
            <i className='fas fa-user'></i> Products
          </div>
          <div className={styles.sub_heading}>
            Below is a list of all the products
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group>
              <Form.Control
                type='text'
                name='description'
                value={description}
                placeholder='Search products'
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Button type='submit' hidden />
            </Form.Group>
          </Form>
          <Row>
            {!loading && products.length > 0 ? (
              products.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  styles={styles}
                />
              ))
            ) : (
              <div className={styles.sub_heading}>No products found</div>
            )}
          </Row>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Products.propTypes = {
  getAllProducts: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  searchProduct: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllProducts,
  searchProduct,
  toggleSideNav,
})(windowSize(Products));
