import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import {
  getProductById,
  likeProduct,
  unlikeProduct
} from '../../../actions/ecommerce/product';
import { connect } from 'react-redux';
import ProductNavigationTabs from './ProductNavigationTabs';
import UserInfo from './UserInfo';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import placeholder from '../../../img/placeholder.png';
import { StripeProvider, Elements } from 'react-stripe-elements';
import PaymentForm from './PaymentForm';
import styles from '../../../css/ecommerce/product/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { Link } from 'react-router-dom';

const Product = ({
  product: { product, loading },
  getProductById,
  match,
  auth,
  likeProduct,
  unlikeProduct
}) => {
  useEffect(() => {
    getProductById(match.params.id);
  }, [getProductById, match.params.id]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const toggleModal = () => {
    setShowPaymentModal(!showPaymentModal);
  };

  const getCategory = category => {
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

  return (
    <Fragment>
      <section className={styles.section}>
        <SideNav styles={styles} />

        <div className={styles.content}>
          <Alert />
          <Modal show={showPaymentModal} onHide={() => toggleModal()} centered>
            <Modal.Header closeButton>
              <Modal.Title>{product !== null && product.title}</Modal.Title>
            </Modal.Header>
            <StripeProvider apiKey='pk_test_qFCTODVMoaT4TXgRvnQ75GPR00dFX40yVb'>
              <Elements>
                <PaymentForm
                  productId={product !== null ? product._id : ''}
                  amount={product !== null ? product.price : ''}
                  toggleModal={toggleModal}
                  auth={auth}
                />
              </Elements>
            </StripeProvider>
          </Modal>

          <div className={styles.heading}>
            {!loading && product !== null && product.title}
          </div>
          <Row className='my-3'>
            <Col md={8}>
              <img
                src={placeholder}
                alt=''
                style={{ width: '100%', height: '500px' }}
              />
            </Col>
            <Col className='p-3' md={4}>
              <div>
                <div>Category:</div>
                <div className={styles.sub_heading}>
                  {!loading &&
                    product !== null &&
                    getCategory(product.category)}
                </div>
              </div>
              <div>
                <div className='mt-3'>Price:</div>
                <div className={styles.sub_heading}>
                  ${!loading && product !== null && product.price}
                </div>
              </div>
              <div>
                <div className='mt-3 mb-2'>Store:</div>
                <Link
                  to={`/ecommerce/store/${!loading &&
                    product !== null &&
                    product.store._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  className={styles.sub_heading}
                >
                  {!loading && product !== null && product.store.name}
                </Link>
              </div>
              <div className='my-2'>
                <Button
                  variant='dark'
                  className='m-1'
                  onClick={() => likeProduct(product._id)}
                >
                  <i class='fas fa-thumbs-up'></i>{' '}
                  {!loading && product !== null && product.likes.length > 0
                    ? product.likes.length
                    : ''}
                </Button>
                <Button
                  variant='dark'
                  className='m-1'
                  onClick={() => unlikeProduct(product._id)}
                >
                  <i class='fas fa-thumbs-down'></i>
                </Button>
              </div>
              {!loading &&
                auth.user !== null &&
                product !== null &&
                auth.user._id !== product.user._id && (
                  <Button
                    variant='primary'
                    className={`mt-3 ${styles.btn_primary}`}
                    onClick={() => toggleModal()}
                  >
                    Buy this product
                  </Button>
                )}
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <ProductNavigationTabs
                product={product}
                auth={auth}
                styles={styles}
              />
            </Col>
            <Col className='p-3' md={4}>
              <UserInfo product={product} styles={styles} />
            </Col>
          </Row>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Product.propTypes = {
  product: PropTypes.object.isRequired,
  getProductById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  likeProduct: PropTypes.func.isRequired,
  unlikeProduct: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  product: state.product,
  auth: state.auth
});
export default connect(mapStateToProps, {
  getProductById,
  likeProduct,
  unlikeProduct
})(Product);