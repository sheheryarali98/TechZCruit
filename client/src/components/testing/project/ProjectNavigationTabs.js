import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const ProjectNavigationTabs = ({ project, auth, styles }) => {
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
                  {project !== null ? project.description : ''}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey='comments'>
                {project !== null && <CommentForm project={project} />}
                {project !== null && project.comments.length > 0 ? (
                  project.comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      auth={auth}
                      project={project}
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

ProjectNavigationTabs.propTypes = {
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ProjectNavigationTabs;
