import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProjectItem = ({
  project: { _id, name, description, url, amount, image },
  styles,
}) => {
  return (
    <Fragment>
      <Col xs={12} md={4} lg={3}>
        <Card className={styles.card}>
          <Card.Img variant='top' src={image} />
          <Card.Body>
            <Card.Title className={`${styles.card_title} text-truncate`}>
              <Link
                to={`/testing/project/${_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {name}
              </Link>
            </Card.Title>
            <Card.Text>
              <div className='text-truncate'>{description}</div>
              <div className='text-truncate'>
                <strong>URL: </strong>
                <a href={url} className='text-truncate'>
                  {url}
                </a>
              </div>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <div className='text-truncate'>
              <strong>Amount: </strong>${amount}
            </div>
          </Card.Footer>
        </Card>
      </Col>
    </Fragment>
  );
};

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ProjectItem;
