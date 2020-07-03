import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getGroupById, updateGroup } from '../../../actions/community/group';
import styles from '../../../css/community/group-forms/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';
import placeholder from '../../../img/placeholder.png';

const EditGroup = ({
  getGroupById,
  match,
  group: { loading, group },
  updateGroup,
  history,
  toggleSideNav,
  windowWidth,
  auth: { displaySideNav },
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  const { name, description, image } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateGroup(formData, match.params.id, history);
  };

  const [getGroupByIdCalled, setGetGroupByIdCalled] = useState(false);

  useEffect(() => {
    if (!getGroupByIdCalled) {
      getGroupById(match.params.id);
      setGetGroupByIdCalled(true);
    }

    setFormData({
      name: !loading && group.name ? group.name : '',
      description: !loading && group.description ? group.description : '',
      image: !loading && group.image ? group.image : '',
    });

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [group, windowWidth]);

  return loading ? (
    <Spinner />
  ) : (
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
            <i className='fas fa-user'></i> Edit Group
          </div>
          <div className={styles.sub_heading}>
            Fill in the following information to edit the group info
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src={image === '' ? placeholder : image}
              alt=''
              style={{ width: '400px', height: '400px', marginBottom: '10px' }}
            />
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group>
              <Form.Control
                type='file'
                onChange={(e) => {
                  handleImageChange(e);
                  e.target.value = '';
                }}
              />
              <Button
                variant='danger'
                style={{ marginTop: '10px' }}
                onClick={() => setFormData({ ...formData, image: '' })}
              >
                Remove image
              </Button>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Name'
                name='name'
                value={name}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as='textarea'
                rows='5'
                placeholder='Description'
                name='description'
                value={description}
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Button
              variant='primary'
              type='submit'
              className={styles.btn_primary}
            >
              Submit
            </Button>
            <Button
              variant='danger'
              className='my-2'
              onClick={() => history.push('/community/my-groups')}
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

EditGroup.propTypes = {
  getGroupById: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  updateGroup: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  group: state.group,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getGroupById,
  updateGroup,
  toggleSideNav,
})(withRouter(windowSize(EditGroup)));
