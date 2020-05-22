import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

const ProjectTesters = ({ testers, styles }) => {
  return (
    <Fragment>
      {testers.map((tester) => (
        <Row className={styles.list_item}>
          <Col xs={12} md={3}>
            <Link to={`/profile/${tester.user._id}`}>
              <img src={tester.user.avatar} alt='' className='round-img' />
            </Link>
          </Col>
          <Col xs={12} md={9}>
            <h2>{tester.user.name}</h2>
            <div>
              <strong>Testing status: </strong>
              {tester.status ? 'Finished' : 'Not finished'}
            </div>
          </Col>
        </Row>
      ))}
    </Fragment>
  );
};

ProjectTesters.propTypes = {
  testers: PropTypes.array.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ProjectTesters;
