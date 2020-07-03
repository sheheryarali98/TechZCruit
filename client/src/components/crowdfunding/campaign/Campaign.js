import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { getCampaignById } from '../../../actions/crowdfunding/campaign';
import { createConversation } from '../../../actions/chat/conversation';
import { connect } from 'react-redux';
import CampaignNavigationTabs from './CampaignNavigationTabs';
import UserInfo from './UserInfo';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import placeholder from '../../../img/placeholder.png';
import Moment from 'react-moment';
import { StripeProvider, Elements } from 'react-stripe-elements';
import SupportForm from './SupportForm';
import styles from '../../../css/crowdfunding/campaign/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';

const Campaign = ({
  campaign: { campaign, loading },
  getCampaignById,
  match,
  auth,
  createConversation,
  history,
  toggleSideNav,
  windowWidth,
}) => {
  const [getCampaignByIdCalled, setGetCampaignByIdCalled] = useState(false);

  useEffect(() => {
    if (!getCampaignByIdCalled) {
      getCampaignById(match.params.id);
      setGetCampaignByIdCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [campaign, windowWidth]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const toggleModal = () => {
    setShowPaymentModal(!showPaymentModal);
  };

  const redirectToChat = async () => {
    const conversationId = await createConversation(
      auth.user._id,
      campaign.user._id
    );

    history.push(`/conversation/${conversationId}`);
  };

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <section className={styles.section}>
        <SideNav styles={styles} />

        <div
          className={`${styles.content} ${
            !auth.displaySideNav ? styles.side_nav_hidden : ''
          }`}
        >
          <Alert />
          <Modal show={showPaymentModal} onHide={() => toggleModal()} centered>
            <Modal.Header closeButton>
              <Modal.Title>{campaign !== null && campaign.title}</Modal.Title>
            </Modal.Header>
            <StripeProvider apiKey='pk_test_qFCTODVMoaT4TXgRvnQ75GPR00dFX40yVb'>
              <Elements>
                <SupportForm
                  campaignId={campaign !== null ? campaign._id : ''}
                  toggleModal={toggleModal}
                  auth={auth}
                />
              </Elements>
            </StripeProvider>
          </Modal>

          <div className={styles.heading}>
            {!loading && campaign !== null ? campaign.title : ''}
          </div>
          <Row className='my-3'>
            <Col xs={12} md={8}>
              <img
                src={
                  !loading && campaign !== null && campaign.image
                    ? campaign.image
                    : placeholder
                }
                alt=''
                className={styles.image}
              />
            </Col>
            <Col className='p-3' xs={12} md={4}>
              <div>
                <div>Funds raised:</div>
                <div className={styles.sub_heading}>
                  $
                  {!loading && campaign !== null
                    ? campaign.supporters
                        .map((supporter) => supporter.amount)
                        .reduce((a, b) => a + b, 0)
                    : ''}
                </div>
                raised of required $
                {!loading && campaign !== null ? campaign.fundsRequired : ''}
              </div>
              <div>
                <div className='mt-3'>Supporters:</div>
                <h3 className={styles.sub_heading}>
                  {!loading && campaign !== null
                    ? campaign.supporters.length
                    : ''}
                </h3>
              </div>
              <div>
                <div className='mt-3'>Completion date:</div>
                <div>
                  {!loading && campaign !== null ? (
                    <Moment format='DD-MMM-YYYY' className={styles.sub_heading}>
                      {campaign.completionDate}
                    </Moment>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {!loading &&
                auth.user !== null &&
                campaign !== null &&
                auth.user._id !== campaign.user._id && (
                  <Fragment>
                    <div>
                      <Button
                        variant='primary'
                        className={`mt-3 ${styles.btn_primary}`}
                        onClick={() => toggleModal()}
                      >
                        Support
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant='dark'
                        className='mt-3'
                        onClick={() => redirectToChat()}
                      >
                        Chat
                      </Button>
                    </div>
                  </Fragment>
                )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}>
              <CampaignNavigationTabs
                campaign={campaign}
                auth={auth}
                styles={styles}
              />
            </Col>
            <Col xs={12} className='p-3' md={4}>
              <UserInfo campaign={campaign} styles={styles} />
            </Col>
          </Row>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Campaign.propTypes = {
  campaign: PropTypes.object.isRequired,
  getCampaignById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  createConversation: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  campaign: state.campaign,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getCampaignById,
  createConversation,
  toggleSideNav,
})(withRouter(windowSize(Campaign)));
