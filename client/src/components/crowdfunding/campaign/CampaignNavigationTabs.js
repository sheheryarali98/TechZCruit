import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const CampaignNavigationTabs = ({ campaign, auth, styles }) => {
  return (
    <Fragment>
      <Tab.Container defaultActiveKey='description'>
        <Row>
          <Col xs={12} md={12}>
            <Nav justify variant='tabs'>
              <Nav.Item>
                <Nav.Link eventKey='description'>Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='comments'>Comments</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <Tab.Content>
              <Tab.Pane eventKey='description'>
                <div className='mt-3'>
                  {campaign !== null ? campaign.description : ''}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey='comments'>
                {campaign !== null && <CommentForm campaign={campaign} />}
                {campaign !== null && campaign.comments.length > 0 ? (
                  campaign.comments.map((comment) => (
                    <CommentItem
                      comment={comment}
                      auth={auth}
                      campaign={campaign}
                      styles={styles}
                    />
                  ))
                ) : (
                  <div className={styles.sub_heading}>No comments found</div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Fragment>
  );
};

CampaignNavigationTabs.propTypes = {
  campaign: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default CampaignNavigationTabs;
