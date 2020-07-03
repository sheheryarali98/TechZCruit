import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import {
  getServiceById,
  updateService,
} from '../../../actions/freelance/service';
import styles from '../../../css/freelance/service-forms/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';
import placeholder from '../../../img/placeholder.png';

const EditCampaign = ({
  getServiceById,
  match,
  service: { service, loading },
  updateService,
  history,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    image: '',
  });

  const { title, description, amount, image } = formData;

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
    updateService(match.params.id, formData, history);
  };

  const [getServiceByIdCalled, setGetServiceByIdCalled] = useState(false);

  useEffect(() => {
    if (!getServiceByIdCalled) {
      getServiceById(match.params.id);
      setGetServiceByIdCalled(true);
    }

    setFormData({
      title: !loading && service.title ? service.title : '',
      description: !loading && service.description ? service.description : '',
      amount: !loading && service.amount ? service.amount : '',
      image: !loading && service.image ? service.image : '',
    });

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [service, windowWidth]);

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
            <i className='fas fa-user'></i> Edit Service
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
                placeholder='Service title'
                name='title'
                value={title}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as='textarea'
                rows='5'
                placeholder='Service description'
                name='description'
                value={description}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Amount'
                name='amount'
                value={amount}
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
              onClick={() => history.push('/freelance/my-services')}
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

EditCampaign.propTypes = {
  getServiceById: PropTypes.func.isRequired,
  service: PropTypes.object.isRequired,
  updateService: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  service: state.service,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getServiceById,
  updateService,
  toggleSideNav,
})(withRouter(windowSize(EditCampaign)));
