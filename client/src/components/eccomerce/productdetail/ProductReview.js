import React, { Fragment } from "react";
import style from "../../../css/ecommerce/ProductDetail.module.css";
import { Tabs, Tab } from "react-bootstrap";
import ReviewSection from "./ReviewSection";

const ProductReview = ({ product, auth }) => {
  return (
    <Fragment>
      <section className={style.product_description_area}>
        <div className={`container`}>
          <Tabs
            className={`navlink`}
            defaultActiveKey='home'
            id='uncontrolled-tab-example'
          >
            <Tab eventKey='home' title='Story'>
              {product.productDescription}
            </Tab>
            <Tab eventKey='profile' title='Comment'>
              <ReviewSection product={product} auth={auth} />

              {/* <CommentForm campaign={campaign} /> */}
              {/* {campaign.comments.map(comment => (
                  <div key={comment._id}>
                    <CommentItem
                      comment={comment}
                      auth={auth}
                      campaignId={campaign._id}
                    />
                  </div>
                ))} */}
            </Tab>
          </Tabs>
        </div>
      </section>
    </Fragment>
  );
};

export default ProductReview;
