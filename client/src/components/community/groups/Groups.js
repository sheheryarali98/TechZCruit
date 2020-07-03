import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAllGroups, searchGroup } from '../../../actions/community/group';
import PropTypes from 'prop-types';
import GroupItem from './GroupItem';
import styles from '../../../css/community/groups/style.module.css';
import SideNav from '../../layout/SideNav';
import Alert from '../../layout/Alert';
import Footer from '../../layout/Footer';
import { Row, Form, Button } from 'react-bootstrap';
import { toggleSideNav } from '../../../actions/auth';
import windowSize from 'react-window-size';
import Spinner from '../../layout/Spinner';

const Groups = ({
  getAllGroups,
  group: { loading, groups },
  auth,
  searchGroup,
  toggleSideNav,
  windowWidth,
}) => {
  const [getAllGroupsCalled, setGetAllGroupsCalled] = useState(false);

  useEffect(() => {
    if (!getAllGroupsCalled) {
      getAllGroups();
      setGetAllGroupsCalled(true);
    }

    toggleSideNav(windowWidth >= 576);
    // eslint-disable-next-line
  }, [groups, windowWidth]);

  const [formData, setFormData] = useState({
    description: '',
  });

  const { description } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (description === '') {
      getAllGroups();
    } else {
      searchGroup(description);
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <section className={styles.section}>
        <SideNav styles={styles} />

        <div
          className={`${styles.content} ${
            !auth.displaySideNav ? styles.side_nav_hidden : ''
          }`}
        >
          <Alert />
          <div className={styles.heading}>Community</div>
          <div className={styles.sub_heading}>
            Become a part of a group to view posts and discussions.
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group>
              <Form.Control
                type='text'
                name='description'
                value={description}
                placeholder='Search groups'
                onChange={(e) => onChange(e)}
              />
            </Form.Group>
            <Form.Group>
              <Button type='submit' hidden />
            </Form.Group>
          </Form>
          <Row>
            {!loading && groups.length > 0 ? (
              groups.map((group) => (
                <GroupItem
                  key={group._id}
                  group={group}
                  auth={auth}
                  styles={styles}
                />
              ))
            ) : (
              <div className={styles.sub_heading}>No groups found</div>
            )}
          </Row>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

Groups.propTypes = {
  getAllGroups: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  searchGroup: PropTypes.func.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  group: state.group,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllGroups,
  searchGroup,
  toggleSideNav,
})(windowSize(Groups));
