import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';

const ServiceNavigationTabs = ({ service, auth, styles }) => {
  return (
    <Fragment>
      <Tab.Container defaultActiveKey='description'>
        <Row>
          <Col md={12}>
            <Nav justify variant='tabs'>
              <Nav.Item>
                <Nav.Link eventKey='description'>Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='reviews'>Reviews</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Tab.Content>
              <Tab.Pane eventKey='description'>
                <div className='mt-3'>
                  {service !== null && service.description}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey='reviews'>
                {service !== null && (
                  <ReviewForm service={service} styles={styles} />
                )}
                {service !== null && service.reviews.length > 0 ? (
                  service.reviews.map(review => (
                    <ReviewItem
                      key={review._id}
                      review={review}
                      auth={auth}
                      service={service}
                      styles={styles}
                    />
                  ))
                ) : (
                  <div className={styles.sub_heading}>No reviews found</div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Fragment>
  );
};

ServiceNavigationTabs.propTypes = {
  service: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
};

export default ServiceNavigationTabs;
