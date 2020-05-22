import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  getAllCampaigns,
  searchCampaign,
} from '../../../actions/crowdfunding/campaign';
import CampaignItem from './CampaignItem';
import styles from '../../../css/crowdfunding/campaigns/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';

const Campaigns = ({
  getAllCampaigns,
  campaign: { loading, campaigns },
  searchCampaign,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  useEffect(() => {
    getAllCampaigns();

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [getAllCampaigns, toggleSideNav]);

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
      getAllCampaigns();
    } else {
      searchCampaign(description);
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
            <i className='fas fa-user'></i> Crowdfunding
          </div>
          <div className={styles.sub_heading}>
            Support a campaign or acquire funding for your own campaigns
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group>
              <Form.Control
                type='text'
                name='description'
                value={description}
                placeholder='Search campaigns'
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Button type='submit' hidden />
            </Form.Group>
          </Form>
          <Row>
            {!loading && campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <CampaignItem
                  key={campaign._id}
                  campaign={campaign}
                  styles={styles}
                />
              ))
            ) : (
              <div className={styles.sub_heading}>No campaigns found</div>
            )}
          </Row>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Campaigns.propTypes = {
  getAllCampaigns: PropTypes.func.isRequired,
  campaign: PropTypes.object.isRequired,
  searchCampaign: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  campaign: state.campaign,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllCampaigns,
  searchCampaign,
  toggleSideNav,
})(windowSize(Campaigns));
