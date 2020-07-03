import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createCampaign } from '../../../actions/crowdfunding/campaign';
import { Form, Button } from 'react-bootstrap';
import styles from '../../../css/crowdfunding/campaign-forms/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import placeholder from '../../../img/placeholder.png';

const CreateCampaign = ({
  createCampaign,
  history,
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
    fundsRequired: '',
    completionDate: '',
    image: '',
  });

  const {
    title,
    description,
    category,
    fundsRequired,
    completionDate,
    image,
  } = formData;

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
    createCampaign(formData, history);
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
            <i className='fas fa-user'></i> Create Campaign
          </div>
          <div className={styles.sub_heading}>
            Fill in the following information to setup your campaign
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
                as='select'
                name='category'
                value={category}
                onChange={(e) => onChange(e)}
              >
                <option value=''>Please select campaign category</option>
                <option value='1'>Technology</option>
                <option value='2'>Games</option>
                <option value='3'>Sports</option>
                <option value='4'>Photography</option>
                <option value='5'>Food</option>
                <option value='6'>Films & Video</option>
                <option value='7'>Music</option>
                <option value='8'>Design</option>
                <option value='9'>Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Campaign title'
                name='title'
                value={title}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as='textarea'
                rows='5'
                placeholder='Campaign description'
                name='description'
                value={description}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Required funds'
                name='fundsRequired'
                value={fundsRequired}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Completion date</Form.Label>
              <Form.Control
                type='date'
                name='completionDate'
                value={completionDate}
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
              onClick={() => history.push('/crowdfunding/my-campaigns')}
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

CreateCampaign.propTypes = {
  createCampaign: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  createCampaign,
  toggleSideNav,
})(withRouter(windowSize(CreateCampaign)));
