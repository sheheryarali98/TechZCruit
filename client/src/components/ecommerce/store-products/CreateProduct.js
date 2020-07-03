import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { createProduct } from '../../../actions/ecommerce/product';
import styles from '../../../css/ecommerce/store-products/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import placeholder from '../../../img/placeholder.png';

const CreateProduct = ({
  history,
  createProduct,
  match,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  useEffect(() => {
    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [toggleSideNav]);
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
    createProduct(match.params.id, formData, history);
  };

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
            <i className='fas fa-user'></i> Create product
          </div>
          <div className={styles.sub_heading}>
            Fill in the following information to create a new product for the
            store
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

CreateProduct.propTypes = {
  createProduct: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  createProduct,
  toggleSideNav,
})(withRouter(windowSize(CreateProduct)));
