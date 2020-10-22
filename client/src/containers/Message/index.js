import React from "react";
import { Col, Grid, Row } from "react-styled-flexboxgrid";
import "./CSS/style.css";
import { Link } from "react-router-dom";

export default function index() {
  return (
    <div className="message">
      <Grid>
        <Row center="xs">
          <Col xs={12} lg={7}>
            <div className="msg-box">
              <h1>Where would you like the message to be sent?</h1>
              <div className="msg-input-wrap">
                <input type="email" placeholder="Email Address" />
              </div>
              <div>{/* Recaptcha Required */}</div>
              <div className="msg-input-btn">
                <button>Submit</button>
                <Link to="/">Go Back</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    </div>
  );
}
