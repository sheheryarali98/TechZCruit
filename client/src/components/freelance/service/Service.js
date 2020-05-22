import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import placeholder from '../../../img/placeholder.png';
import { connect } from 'react-redux';
import { getServiceById } from '../../../actions/freelance/service';
import UserInfo from './UserInfo';
import styles from '../../../css/freelance/service/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CustomRequestForm from './CustomRequestForm';
import DefaultRequestForm from './DefaultRequestForm';
import ServiceNavigationTabs from './ServiceNavigationTabs';
import { createConversation } from '../../../actions/chat/conversation';
import { withRouter } from 'react-router-dom';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';

const Service = ({
  service: { loading, service },
  getServiceById,
  match,
  auth,
  createConversation,
  history,
  toggleSideNav,
  windowWidth,
}) => {
  useEffect(() => {
    getServiceById(match.params.id);

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [getServiceById, match.params.id, toggleSideNav]);

  const [
    showCustomOfferPaymentModal,
    setshowCustomOfferPaymentModal,
  ] = useState(false);

  const toggleCustomOfferPaymentModal = () => {
    setshowCustomOfferPaymentModal(!showCustomOfferPaymentModal);
  };

  const [
    showDefaultOfferPaymentModal,
    setShowDefaultOfferPaymentModal,
  ] = useState(false);

  const toggleDefaultOfferPaymentModal = () => {
    setShowDefaultOfferPaymentModal(!showDefaultOfferPaymentModal);
  };

  const redirectToChat = async () => {
    const conversationId = await createConversation(
      auth.user._id,
      service.user._id
    );

    history.push(`/conversation/${conversationId}`);
  };

  return (
    <Fragment>
      <section className={styles.section}>
        <SideNav styles={styles} />

        <div
          className={`${styles.content} ${
            !auth.displaySideNav ? styles.side_nav_hidden : ''
          }`}
        >
          <Alert />
          <Modal
            show={showDefaultOfferPaymentModal}
            onHide={() => toggleDefaultOfferPaymentModal()}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>{service !== null && service.title}</Modal.Title>
            </Modal.Header>
            <StripeProvider apiKey='pk_test_qFCTODVMoaT4TXgRvnQ75GPR00dFX40yVb'>
              <Elements>
                <DefaultRequestForm
                  serviceId={service !== null ? service._id : ''}
                  toggleModal={toggleDefaultOfferPaymentModal}
                  amount={service !== null ? service.amount : ''}
                />
              </Elements>
            </StripeProvider>
          </Modal>

          <Modal
            show={showCustomOfferPaymentModal}
            onHide={() => toggleCustomOfferPaymentModal()}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>{service !== null && service.title}</Modal.Title>
            </Modal.Header>
            <StripeProvider apiKey='pk_test_qFCTODVMoaT4TXgRvnQ75GPR00dFX40yVb'>
              <Elements>
                <CustomRequestForm
                  serviceId={service !== null ? service._id : ''}
                  toggleModal={toggleCustomOfferPaymentModal}
                />
              </Elements>
            </StripeProvider>
          </Modal>

          <div className={styles.heading}>
            {!loading && service !== null ? service.title : ''}
          </div>
          <Row className='my-3'>
            <Col xs={12} md={8}>
              <img src={placeholder} alt='' className={styles.image} />
            </Col>
            <Col xs={12} className='p-3' md={4}>
              <div>
                <div>Price:</div>
                <h3 className={styles.sub_heading}>
                  ${!loading && service !== null ? service.amount : ''}
                </h3>
              </div>
              {!loading &&
                service !== null &&
                auth.user !== null &&
                service.user._id !== auth.user._id && (
                  <Fragment>
                    <div>
                      <Button
                        variant='primary'
                        className={`mt-3 ${styles.btn_primary}`}
                        onClick={() => toggleDefaultOfferPaymentModal()}
                      >
                        Request service
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant='dark'
                        className='mt-3'
                        onClick={() => toggleCustomOfferPaymentModal()}
                      >
                        Request custom service
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant='dark'
                        className='mt-3'
                        onClick={() => redirectToChat()}
                      >
                        Chat with owner
                      </Button>
                    </div>
                  </Fragment>
                )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}>
              <ServiceNavigationTabs
                service={service}
                auth={auth}
                styles={styles}
              />
            </Col>
            <Col xs={12} md={4}>
              <UserInfo service={service} styles={styles} />
            </Col>
          </Row>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Service.propTypes = {
  service: PropTypes.object.isRequired,
  getServiceById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  createConversation: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  service: state.service,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getServiceById,
  createConversation,
  toggleSideNav,
})(withRouter(windowSize(Service)));
