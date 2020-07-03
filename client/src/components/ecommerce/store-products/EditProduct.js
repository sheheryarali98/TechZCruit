import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  updateProduct,
  getProductById,
} from '../../../actions/ecommerce/product';
import styles from '../../../css/ecommerce/store-products/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';
import placeholder from '../../../img/placeholder.png';

const EditProduct = ({
  history,
  updateProduct,
  match,
  getProductById,
  product: { loading, product },
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: '',
  });

  const { title, description, category, price, image } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateProduct(match.params.id, match.params.product_id, formData, history);
  };

  const [getProductByIdCalled, setGetProductByIdCalled] = useState(false);

  useEffect(() => {
    if (!getProductByIdCalled) {
      getProductById(match.params.product_id);
      setGetProductByIdCalled(true);
    }

    setFormData({
      title: !loading && product.title ? product.title : '',
      description: !loading && product.description ? product.description : '',
      category: !loading && product.category ? product.category : '',
      price: !loading && product.price ? product.price : '',
      image: !loading && product.image ? product.image : '',
    });

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [product, windowWidth]);

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
            <i className='fas fa-user'></i> Edit product
          </div>
          <div className={styles.sub_heading}>
            Fill in the following information to edit the product for the store
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src={image === '' ? placeholder : image}
              alt=''
              style={{ width: '400px', height: '400px', marginBottom: '10px' }}
            />
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group>
              <Form.Control
                type='file'
                onChange={(e) => {
                  handleImageChange(e);
                  e.target.value = '';
                }}
              />
              <Button
                variant='danger'
                style={{ marginTop: '10px' }}
                onClick={() => setFormData({ ...formData, image: '' })}
              >
                Remove image
              </Button>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type='text'
                name='title'
                value={title}
                placeholder='Title'
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as='textarea'
                rows='5'
                name='description'
                value={description}
                placeholder='Description'
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as='select'
                name='category'
                value={category}
                onChange={(e) => onChange(e)}
              >
                <option value=''>Please select product category</option>
                <option value='1'>Web</option>
                <option value='2'>Desktop</option>
                <option value='3'>Android</option>
                <option value='4'>IOS</option>
                <option value='5'>React Native</option>
                <option value='6'>Flutter</option>
                <option value='7'>Ionic</option>
                <option value='8'>Cross Platform</option>
                <option value='9'>Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type='number'
                name='price'
                value={price}
                placeholder='Price in US dollars'
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Button
              variant='primary'
              className={styles.btn_primary}
              type='submit'
            >
              Submit
            </Button>
            <Button
              variant='danger'
              className='my-2'
              onClick={() =>
                history.push(`/ecommerce/store/products/${match.params.id}`)
              }
            >
              Cancel
            </Button>
          </Form>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

EditProduct.propTypes = {
  updateProduct: PropTypes.func.isRequired,
  getProductById: PropTypes.func.isRequired,
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
  updateProduct,
  getProductById,
  toggleSideNav,
})(withRouter(windowSize(EditProduct)));
