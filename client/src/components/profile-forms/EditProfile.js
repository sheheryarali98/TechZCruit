import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createProfile, getCurrentProfile } from '../../actions/profile';
import SideNav from '../layout/SideNav';
import Alert from '../layout/Alert';
import { Form, Button } from 'react-bootstrap';
import Footer from '../layout/Footer';
import styles from '../../css/profile-forms/style.module.css';
import { toggleSideNav } from '../../actions/auth';
import windowSize from 'react-window-size';

const EditProfile = ({
  createProfile,
  getCurrentProfile,
  history,
  profile: { loading, profile },
  windowWidth,
  auth: { displaySideNav },
  toggleSideNav,
}) => {
  const [formData, setFormData] = useState({
    status: '',
    company: '',
    website: '',
    location: '',
    skills: '',
    githubUsername: '',
    bio: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
  });

  const {
    status,
    company,
    website,
    location,
    skills,
    githubUsername,
    bio,
    facebook,
    twitter,
    linkedin,
    instagram,
    youtube,
  } = formData;

  useEffect(() => {
    getCurrentProfile();

    toggleSideNav(windowWidth >= 576);

    setFormData({
      status: !loading && profile.status ? profile.status : '',
      company: !loading && profile.company ? profile.company : '',
      website: !loading && profile.website ? profile.website : '',
      location: !loading && profile.location ? profile.location : '',
      githubUsername:
        !loading && profile.githubUsername ? profile.githubUsername : '',
      bio: !loading && profile.bio ? profile.bio : '',
      skills: !loading && profile.skills ? profile.skills.join(',') : '',
      facebook:
        !loading && profile.socialLinks ? profile.socialLinks.facebook : '',
      twitter:
        !loading && profile.socialLinks ? profile.socialLinks.twitter : '',
      linkedin:
        !loading && profile.socialLinks ? profile.socialLinks.linkedin : '',
      instagram:
        !loading && profile.socialLinks ? profile.socialLinks.instagram : '',
      youtube:
        !loading && profile.socialLinks ? profile.socialLinks.youtube : '',
    });

    // eslint-disable-next-line
  }, [loading, getCurrentProfile.toggleSideNav]);

  const [displaySocialLinks, setDisplaySocialLinks] = useState(false);

  const toggleSocialLinks = () => {
    setDisplaySocialLinks(!displaySocialLinks);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history, true);
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
            <i className='fas fa-user'></i> Edit Profile
          </div>
          <div className={styles.sub_heading}>
            Fill in the following information to edit your profile
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group>
              <Form.Control
                as='select'
                name='status'
                value={status}
                onChange={(e) => onChange(e)}
              >
                <option value=''>Please select your professional status</option>
                <option value='Developer'>Developer</option>
                <option value='Student'>Student</option>
                <option value='Instructor'>Instructor</option>
                <option value='Intern'>Intern</option>
                <option value='Other'>Other</option>
              </Form.Control>
              <Form.Text className='text-muted'>
                Select your current status from the above mentioned options
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Company'
                name='company'
                value={company}
                onChange={(e) => onChange(e)}
              />
              <Form.Text className='text-muted'>
                This can be your own company and also a company that you work
                for
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Website'
                name='website'
                value={website}
                onChange={(e) => onChange(e)}
              />
              <Form.Text className='text-muted'>
                This is the webiste website where you showcase your work
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Location'
                name='location'
                value={location}
                onChange={(e) => onChange(e)}
              />
              <Form.Text className='text-muted'>
                This is your location where you live or work at
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Skills'
                name='skills'
                value={skills}
                onChange={(e) => onChange(e)}
              />
              <Form.Text className='text-muted'>
                Please enter your skills separated by commas such as HTML, CSS,
                JavaScript etc.
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Control
                type='text'
                placeholder='GitHub username'
                name='githubUsername'
                value={githubUsername}
                onChange={(e) => onChange(e)}
              />
              <Form.Text className='text-muted'>
                Please enter your GitHub username
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Control
                as='textarea'
                cols='30'
                rows='5'
                placeholder='A short bio about yourself'
                name='bio'
                value={bio}
                onChange={(e) => onChange(e)}
              ></Form.Control>
              <Form.Text className='text-muted'>
                Please enter some information so that people may get to know you
              </Form.Text>
            </Form.Group>

            <div className='my-3'>
              <Button onClick={toggleSocialLinks} variant='primary'>
                Add Social Network Links (Optional)
              </Button>
            </div>

            {displaySocialLinks && (
              <Fragment>
                <div className={styles.social_input}>
                  <i
                    className={`fab fa-facebook fa-2x ${styles.fa_facebook}`}
                  ></i>
                  <Form.Control
                    type='text'
                    placeholder='Fabebook URL'
                    name='facebook'
                    value={facebook}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className={styles.social_input}>
                  <i
                    className={`fab fa-twitter fa-2x ${styles.fa_twitter}`}
                  ></i>
                  <Form.Control
                    type='text'
                    placeholder='Twitter URL'
                    name='twitter'
                    value={twitter}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className={styles.social_input}>
                  <i
                    className={`fab fa-linkedin fa-2x ${styles.fa_linkedin}`}
                  ></i>
                  <Form.Control
                    type='text'
                    placeholder='Linkedin URL'
                    name='linkedin'
                    value={linkedin}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className={styles.social_input}>
                  <i
                    className={`fab fa-instagram fa-2x ${styles.fa_instagram}`}
                  ></i>
                  <Form.Control
                    type='text'
                    placeholder='Instagram URL'
                    name='instagram'
                    value={instagram}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                <div className={styles.social_input}>
                  <i
                    className={`fab fa-youtube fa-2x ${styles.fa_youtube}`}
                  ></i>
                  <Form.Control
                    type='text'
                    placeholder='Youtube URL'
                    name='youtube'
                    value={youtube}
                    onChange={(e) => onChange(e)}
                  />
                </div>
              </Fragment>
            )}
            <Button
              variant='primary'
              type='submit'
              className={`${styles.btn_primary} my-2`}
            >
              Submit
            </Button>
            <Button
              variant='danger'
              className='my-2'
              onClick={() => history.push('/dashboard')}
            >
              Cancel
            </Button>
          </Form>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  createProfile,
  getCurrentProfile,
  toggleSideNav,
})(withRouter(windowSize(EditProfile)));
