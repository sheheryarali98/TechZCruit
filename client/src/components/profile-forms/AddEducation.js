import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';
import styles from '../../css/profile-forms/style.module.css';
import SideNav from '../layout/SideNav';
import Alert from '../layout/Alert';
import Footer from '../layout/Footer';
import { Form, Button } from 'react-bootstrap';
import { toggleSideNav } from '../../actions/auth';
import windowSize from 'react-window-size';

const AddEducation = ({
  addEducation,
  history,
  auth: { displaySideNav },
  toggleSideNav,
  windowWidth,
}) => {
  useEffect(() => {
    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [toggleSideNav]);

  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    from: '',
    current: false,
    to: '',
  });

  const { school, degree, fieldOfStudy, from, current, to } = formData;

  const [disableToDate, setDisableToDate] = useState(false);

  const toggleDisplayToDate = () => {
    setDisableToDate(!disableToDate);
    setFormData({ ...formData, to: '', current: !current });
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addEducation(formData, history);
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
            <i className='fas fa-book'></i> Add Education
          </div>
          <div className={styles.sub_heading}>
            Fill in the the following information to add an education
          </div>

          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group>
              <Form.Control
                type='text'
                placeholder='School'
                name='school'
                value={school}
                onChange={(e) => onChange(e)}
              />
              <Form.Text className='text-muted'>
                The name of the school you got your education from
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Degree'
                name='degree'
                value={degree}
                onChange={(e) => onChange(e)}
              />
              <Form.Text className='text-muted'>
                The title of your degree such as Bachelor's, Master's etc.
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Field of Study'
                name='fieldOfStudy'
                value={fieldOfStudy}
                onChange={(e) => onChange(e)}
              />
              <Form.Text className='text-muted'>
                The specific field of study of your degree
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor='from-date'>From Date</Form.Label>
              <Form.Control
                id='from-date'
                type='date'
                name='from'
                value={from}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                id='current'
                type='checkbox'
                label='Current'
                name='current'
                value={current}
                onChange={toggleDisplayToDate}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor='to-date'>To Date</Form.Label>
              <Form.Control
                id='to-date'
                type='date'
                disabled={disableToDate}
                name='to'
                value={to}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>

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

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  addEducation,
  toggleSideNav,
})(withRouter(windowSize(AddEducation)));
