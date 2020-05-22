import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import { deleteCommentOnCampaign } from '../../../actions/crowdfunding/campaign';

const CommentItem = ({
  comment,
  auth,
  campaign,
  deleteCommentOnCampaign,
  styles,
}) => {
  return (
    <Fragment>
      <Row className={styles.list_item}>
        <Col xs={12} md={12} lg={3}>
          <Link to={`/profile/${comment.user._id}`}>
            <img src={comment.user.avatar} alt='' className='round-img' />
            <div className={styles.user_name}>{comment.user.name}</div>
          </Link>
        </Col>
        <Col xs={12} md={12} lg={9}>
          <div className='mb-3'>{comment.description}</div>
          <div>
            {auth.user !== null &&
              (auth.user._id === campaign.user._id ||
                auth.user._id === comment.user._id) && (
                <Button
                  variant='danger'
                  onClick={() =>
                    deleteCommentOnCampaign(campaign._id, comment._id)
                  }
                >
                  Delete comment
                </Button>
              )}
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  deleteCommentOnCampaign: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default connect(null, {
  deleteCommentOnCampaign,
})(CommentItem);
