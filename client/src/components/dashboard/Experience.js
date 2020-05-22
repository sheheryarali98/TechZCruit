import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { removeExperience } from '../../actions/profile';
import { Table } from 'react-bootstrap';

const Experience = ({ styles, experiences, removeExperience }) => {
  return (
    <Fragment>
      <div className={styles.title}>Experience Credentials</div>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th scope='col'>Company</th>
            <th scope='col'>From</th>
            <th scope='col'>To</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {experiences.map((experience) => (
            <tr key={experience._id}>
              <td>{experience.company}</td>
              <td>
                <Moment format='DD-MMM-YYYY'>{experience.from}</Moment>
              </td>
              <td>
                {experience.current ? (
                  'Now'
                ) : (
                  <Moment format='DD-MMM-YYYY'>{experience.to}</Moment>
                )}
              </td>
              <td>
                <button
                  onClick={() => removeExperience(experience._id)}
                  className='btn btn-danger'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  );
};

Experience.propTypes = {
  experiences: PropTypes.array.isRequired,
  removeExperience: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default connect(null, { removeExperience })(Experience);
