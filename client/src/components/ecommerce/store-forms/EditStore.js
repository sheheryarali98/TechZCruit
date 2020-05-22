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
  });

  const { name, description } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateStore(formData, match.params.id, history);
  };

  useEffect(() => {
    getStoreById(match.params.id);

    setFormData({
      name: !loading && store.name ? store.name : '',
      description: !loading && store.description ? store.description : '',
    });

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [getStoreById, loading, match.params.id, toggleSideNav]);

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
            <i className='fas fa-user'></i> Edit Store
          </div>
          <div className={styles.sub_heading}>
            Fill in the following information to edit the store info
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
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
