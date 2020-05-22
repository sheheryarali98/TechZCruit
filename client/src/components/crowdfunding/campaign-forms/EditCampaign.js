import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import {
  getCampaignById,
  updateCampaign,
} from '../../../actions/crowdfunding/campaign';
import styles from '../../../css/crowdfunding/campaign-forms/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';

const EditCampaign = ({
  getCampaignById,
  match,
  campaign: { campaign, loading },
  updateCampaign,
  history,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    fundsRequired: '',
    completionDate: '',
  });

  const {
    title,
    description,
    category,
    fundsRequired,
    completionDate,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateCampaign(match.params.id, formData, history);
  };

  useEffect(() => {
    getCampaignById(match.params.id);

    setFormData({
      title: !loading && campaign.title ? campaign.title : '',
      description: !loading && campaign.description ? campaign.description : '',
      category: !loading && campaign.category ? campaign.category : '',
      fundsRequired:
        !loading && campaign.fundsRequired ? campaign.fundsRequired : '',
      completionDate:
        !loading && campaign.completionDate
          ? campaign.completionDate.split('T')[0]
          : '',
    });

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [getCampaignById, loading, toggleSideNav]);

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
            <i className='fas fa-user'></i> Edit Campaign
          </div>
          <div className={styles.sub_heading}>
            Fill in the following information to edit your campaign
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
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

EditCampaign.propTypes = {
  getCampaignById: PropTypes.func.isRequired,
  campaign: PropTypes.object.isRequired,
  updateCampaign: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  campaign: state.campaign,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getCampaignById,
  updateCampaign,
  toggleSideNav,
})(withRouter(windowSize(EditCampaign)));
