import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

const ProfileTop = ({
  profile: {
    user: { name, avatar },
    status,
    company,
    location,
    website,
    socialLinks,
  },
  styles,
}) => {
  return (
    <Fragment>
      <Row className={`p-3 my-3 ${styles.profile_top}`}>
        <Col md={12}>
          <Row>
            <Col md={12}>
              <img
                src={avatar}
                alt=''
                className='round-img'
                style={{ width: '200px', height: '200px' }}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className={styles.heading}>{name}</div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className={styles.sub_heading}>
                {status} {company ? `at ${company}` : ''}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className={styles.sub_heading}>{location}</div>
            </Col>
          </Row>
          <Row>
            <Col md={12} className={styles.social_links}>
              {website && (
                <a href={website}>
                  <i className='fas fa-globe fa-2x'></i>
                </a>
              )}

              {socialLinks && socialLinks.facebook && (
                <a href={socialLinks.facebook}>
                  <i className='fab fa-facebook fa-2x'></i>
                </a>
              )}

              {socialLinks && socialLinks.twitter && (
                <a href={socialLinks.twitter}>
                  <i className='fab fa-twitter fa-2x'></i>
                </a>
              )}

              {socialLinks && socialLinks.linkedin && (
                <a href={socialLinks.linkedin}>
                  <i className='fab fa-linkedin fa-2x'></i>
                </a>
              )}

              {socialLinks && socialLinks.instagram && (
                <a href={socialLinks.instagram}>
                  <i className='fab fa-instagram fa-2x'></i>
                </a>
              )}

              {socialLinks && socialLinks.youtube && (
                <a href={socialLinks.youtube}>
                  <i className='fab fa-youtube fa-2x'></i>
                </a>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ProfileTop;
