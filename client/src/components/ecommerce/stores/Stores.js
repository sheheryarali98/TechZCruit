import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getAllStores, searchStore } from '../../../actions/ecommerce/store';
import StoreItem from './StoreItem';
import styles from '../../../css/ecommerce/stores/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';

const Stores = ({
  getAllStores,
  store: { loading, stores },
  searchStore,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  useEffect(() => {
    getAllStores();

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [getAllStores, toggleSideNav]);

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
      getAllStores();
    } else {
      searchStore(description);
    }
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
            <i className='fas fa-user'></i> Stores
          </div>
          <div className={styles.sub_heading}>
            Below is a list of all the stores
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group>
              <Form.Control
                type='text'
                name='description'
                value={description}
                placeholder='Search stores'
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Button type='submit' hidden />
            </Form.Group>
          </Form>
          <Row>
            {!loading && stores.length > 0 ? (
              stores.map((store) => (
                <StoreItem key={store._id} store={store} styles={styles} />
              ))
            ) : (
              <div className={styles.sub_heading}>No stores found</div>
            )}
          </Row>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Stores.propTypes = {
  getAllStores: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  searchStore: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  store: state.store,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllStores,
  searchStore,
  toggleSideNav,
})(windowSize(Stores));
