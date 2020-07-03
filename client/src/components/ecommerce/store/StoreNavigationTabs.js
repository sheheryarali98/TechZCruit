import React, { Fragment } from 'react';
import { Tab, Row, Col, Nav, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Spinner from '../../layout/Spinner';

const StoreNavigationTabs = ({
  store,
  product: { loading, products },
  styles,
}) => {
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Tab.Container defaultActiveKey='products'>
        <Row>
          <Col md={12}>
            <Nav justify variant='tabs'>
              <Nav.Item>
                <Nav.Link eventKey='products'>Products</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='description'>Description</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Tab.Content>
              <Tab.Pane eventKey='products'>
                <div className={styles.sub_heading}>
                  Below is a list of all the products available in the store
                </div>
                <Row className='mt-3'>
                  {!loading && products.length > 0 ? (
                    products.map((product) => (
                      <Col xs={12} md={4} lg={3} key={product._id}>
                        <Card className={styles.card}>
                          <Card.Img src={product.image} />
                          <Card.Body>
                            <Card.Title
                              className={`${styles.card_title} text-truncate`}
                            >
                              <Link
                                to={`/ecommerce/product/${product._id}`}
                                style={{
                                  textDecoration: 'none',
                                  color: 'inherit',
                                }}
                              >
                                {product.title}
                              </Link>
                            </Card.Title>
                            <Card.Text>
                              <div className='text-truncate my-2'>
                                {product.description}
                              </div>
                            </Card.Text>
                          </Card.Body>
                          <Card.Footer className='text-truncate'>
                            <strong>Price: </strong>${product.price}
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <div className={styles.sub_heading}>No products found</div>
                  )}
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey='description'>
                <div className='mt-3'>
                  {!loading && store !== null && store.description}
                </div>
              </Tab.Pane>
              {/* <Tab.Pane eventKey='posts'>
                {auth.user !== null &&
                group !== null &&
                (group.admin._id === auth.user._id ||
                  group.members
                    .map(member => member.user._id)
                    .indexOf(auth.user._id) > -1) ? (
                  <Posts
                    group={group}
                    post={post}
                    auth={auth}
                    styles={styles}
                  />
                ) : (
                  <div className='lead my-3'>
                    You must be a member of this group to view posts
                  </div>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey='members'>
                <GroupMembers group={group} auth={auth} styles={styles} />
              </Tab.Pane>
              {auth.user !== null &&
                group !== null &&
                group.admin._id === auth.user._id && (
                  <Tab.Pane eventKey='requests'>
                    <GroupRequests group={group} styles={styles} />
                  </Tab.Pane>
                )} */}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Fragment>
  );
};

StoreNavigationTabs.propTypes = {
  store: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
};

export default StoreNavigationTabs;
