import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import GroupMemberItem from './GroupMemberItem';

const GroupMembers = ({ group, auth, styles }) => {
  return (
    <Fragment>
      {group !== null ? (
        <GroupMemberItem
          member={group.admin}
          isAdmin={true}
          auth={auth}
          styles={styles}
          group={group}
        />
      ) : (
        'No members found'
      )}
      {group !== null
        ? group.members.map(member => (
            <GroupMemberItem
              key={member._id}
              member={member.user}
              isAdmin={false}
              auth={auth}
              group={group}
              styles={styles}
            />
          ))
        : ''}
    </Fragment>
  );
};

GroupMembers.propTypes = {
  group: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
};

export default GroupMembers;
