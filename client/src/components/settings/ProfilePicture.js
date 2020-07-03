import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { uploadProfilePicture, removeProfilePicture } from '../../actions/auth';

const ProfilePicture = ({
  auth: { user },
  uploadProfilePicture,
  removeProfilePicture,
  styles,
}) => {
  const [formData, setFormData] = useState({
    image: '',
  });

  const onChange = (e) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({ ...formData, image: e.target.result });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    uploadProfilePicture(formData);
    setFormData({ image: '' });
  };

  return (
    <Fragment>
      <Row>
        <Col md={12}>
          <div className={styles.sub_heading}>Profile Picture</div>
          <div style={{ textAlign: 'center' }}>
            <img
              src={user !== null ? user.avatar : ''}
              alt=''
              className='round-img my-3'
              style={{ width: '200px', height: '200px' }}
            ></img>
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group>
              <Form.Control type='file' onChange={(e) => onChange(e)} />
            </Form.Group>
            <Button
              variant='primary'
              type='submit'
              className={styles.btn_primary}
            >
              Upload profile picture
            </Button>
            <Button
              variant='danger'
              className='my-3'
              onClick={() => removeProfilePicture()}
            >
              Remove profile picture
            </Button>
          </Form>
        </Col>
      </Row>
      <hr />
    </Fragment>
  );
};

ProfilePicture.propTypes = {
  auth: PropTypes.object.isRequired,
  uploadProfilePicture: PropTypes.func.isRequired,
  removeProfilePicture: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default connect(null, {
  uploadProfilePicture,
  removeProfilePicture,
})(ProfilePicture);
