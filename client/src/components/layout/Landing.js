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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
                quae consectetur adipisci corporis, dolorum laudantium nostrum
                veniam voluptates quas cupiditate architecto rerum excepturi
                reiciendis quos necessitatibus magni at optio officia.
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus consectetur magnam tempora recusandae, esse,
                doloribus dignissimos, fugit sint enim expedita nam in
                laboriosam ea exercitationem ullam voluptas quas soluta dolores!
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                est voluptate, voluptatibus provident nulla, voluptatem eligendi
                at consectetur officiis, ullam aliquid. Dolores et omnis
                reprehenderit quibusdam perspiciatis, eligendi hic quam!
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                aut magnam labore quod repellendus, nesciunt reprehenderit ex
                nostrum autem a praesentium tempora pariatur earum officia dolor
                asperiores quasi ducimus itaque?
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Assumenda dolorum tenetur aliquid! Optio facere odio, sequi
                tenetur voluptates aperiam voluptatem nihil cum, iste quibusdam
                dolore, obcaecati exercitationem eaque quisquam! Tenetur!
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
