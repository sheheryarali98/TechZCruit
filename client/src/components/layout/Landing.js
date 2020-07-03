import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Footer from './Footer';
import styles from '../../css/landing/style.module.css';

const Landing = () => {
  return (
    <Fragment>
      <section className={styles.section}>
        <div className={styles.banner}>
          <div className={styles.main_title}>TechZCruit</div>
          <div className={styles.description}>
            Aquire freelance services, buy and sell software products, get
            software products tested, acquire funding for software projects, and
            become a part of the community.
          </div>
        </div>

        <div className={styles.services}>
          <div className={styles.heading}>OUR SERVICES</div>
          <Row className={styles.row}>
            <Col xs={12} md={5} className={styles.service}>
              <div>
                <i className='fas fa-users fa-2x'></i>
              </div>
              <strong>
                <Link to='/community'>Community</Link>
              </strong>
              <div>
                Become a part of the community to share your thoughts and ideas
                with other people and learn about other's opinions as well.
              </div>
            </Col>
            <Col xs={12} md={5} className={styles.service}>
              <div>
                <i className='fab fa-think-peaks fa-2x'></i>
              </div>
              <strong>
                <Link to='/crowdfunding'>Crowdfunding</Link>
              </strong>
              <div>
                Receive funding for your own creative ideas or learn about other
                peoples inventions and support them in their journey
              </div>
            </Col>
            <Col xs={12} md={5} className={styles.service}>
              <div>
                <i className='fas fa-tasks fa-2x'></i>
              </div>
              <strong>
                <Link to='/testing'>Product Testing</Link>
              </strong>
              <div>
                Get your software product tested by other people in the
                community or test the products that are already available by
                other developers.
              </div>
            </Col>
            <Col xs={12} md={5} className={styles.service}>
              <div>
                <i className='fas fa-shopping-cart fa-2x'></i>
              </div>
              <strong>
                <Link to='/ecommerce'>E-commerce</Link>
              </strong>
              <div>
                Create and sell your own custom made softwares and components or
                purchase already made components and use them in your
                application.
              </div>
            </Col>
            <Col xs={12} md={5} className={styles.service}>
              <div>
                <i className='fas fa-wallet fa-2x'></i>
              </div>
              <strong>
                <Link to='/freelance'>Freelance Platform</Link>
              </strong>
              <div>
                Acquire services from other freelancers in the community or
                offer your own services to the community.
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <Footer styles={styles} />
    </Fragment>
  );
};

export default Landing;
