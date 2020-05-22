import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { removeEducation } from '../../actions/profile';
import { Table } from 'react-bootstrap';

const Education = ({ styles, education, removeEducation }) => {
  return (
    <Fragment>
      <div className={styles.title}>Education Credentials</div>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th scope='col'>School</th>
            <th scope='col'>From</th>
            <th scope='col'>To</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {education.map((education) => (
            <tr key={education._id}>
              <td>{education.school}</td>
              <td>
                <Moment format='DD-MMM-YYYY'>{education.from}</Moment>
              </td>
              <td>
                {education.current ? (
                  'Now'
                ) : (
                  <Moment format='DD-MMM-YYYY'>{education.to}</Moment>
                )}
              </td>
              <td>
                <button
                  onClick={() => removeEducation(education._id)}
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

Education.propTypes = {
  education: PropTypes.array.isRequired,
  removeEducation: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default connect(null, { removeEducation })(Education);
