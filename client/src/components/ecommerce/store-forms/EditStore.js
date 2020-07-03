import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getStoreById, updateStore } from '../../../actions/ecommerce/store';
import styles from '../../../css/ecommerce/store-forms/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';
import placeholder from '../../../img/placeholder.png';

const EditGroup = ({
  getStoreById,
  match,
  store: { loading, store },
  updateStore,
  history,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  const { name, description, image } = formData;

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
    updateStore(formData, match.params.id, history);
  };

  const [getStoreByIdCalled, setGetStoreByIdCalled] = useState(false);

  useEffect(() => {
    if (!getStoreByIdCalled) {
      getStoreById(match.params.id);
      setGetStoreByIdCalled(true);
    }

    setFormData({
      name: !loading && store.name ? store.name : '',
      description: !loading && store.description ? store.description : '',
      image: !loading && store.image ? store.image : '',
    });

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
            <i className='fas fa-user'></i> Edit Store
          </div>
          <div className={styles.sub_heading}>
            Fill in the following information to edit the store info
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
                placeholder='Name'
                name='name'
                value={name}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as='textarea'
                rows='5'
                placeholder='Description'
                name='description'
                value={description}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Button
              variant='primary'
              type='submit'
              className={styles.btn_primary}
            >
              Submit
            </Button>
            <Button
              variant='danger'
              className='my-2'
              onClick={() => history.push('/ecommerce/my-stores')}
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

EditGroup.propTypes = {
  getStoreById: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  updateStore: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  store: state.store,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getStoreById,
  updateStore,
  toggleSideNav,
})(withRouter(windowSize(EditGroup)));
