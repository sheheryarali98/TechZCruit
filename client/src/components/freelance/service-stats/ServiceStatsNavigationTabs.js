import React, { Fragment } from 'react';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ServiceServices from './ServiceServices';
import ServiceRequests from './ServiceRequests';
import { StripeProvider, Elements } from 'react-stripe-elements';

const ServiceStatsNavigationTabs = ({ service, styles }) => {
  return (
    <Fragment>
      <Tab.Container defaultActiveKey='services'>
        <Row>
          <Col md={12}>
            <Nav justify variant='tabs'>
              <Nav.Item>
                <Nav.Link eventKey='services'>Services</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='requests'>Requests</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Tab.Content>
              <Tab.Pane eventKey='services'>
                {service !== null && service.services.length > 0 ? (
                  <ServiceServices service={service} />
                ) : (
                  <div className={styles.sub_heading}>No services found</div>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey='requests'>
                <StripeProvider apiKey='pk_test_qFCTODVMoaT4TXgRvnQ75GPR00dFX40yVb'>
                  <Elements>
                    {service !== null && service.requests.length > 0 ? (
                      <ServiceRequests service={service} styles={styles} />
                    ) : (
                      <div className={styles.sub_heading}>
                        No requests found
                      </div>
                    )}
                  </Elements>
                </StripeProvider>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Fragment>
  );
};

ServiceStatsNavigationTabs.propTypes = {
  service: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
};

export default ServiceStatsNavigationTabs;
