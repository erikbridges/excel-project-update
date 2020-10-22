import React, { Fragment, useState, useEffect } from "react";
import { Grid, Row, Col } from "react-styled-flexboxgrid";
import "./CSS/style.css";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";

const Index = function ({ history }) {
  const [data, setData] = useState({ data: [] });
  useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await axios(
            'http://localhost:5000/api/load-excel',
            { headers: {"Authorization" : `Bearer ${localStorage.getItem("adminToken")}`} }
          );
     
          setData(result.data);

        } catch (ex) {
          console.error(ex);
          history.push("/login");
        }
      };
   
      fetchData();
 
  }, [])

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    history.push("/login");
  }
  return (
    <Fragment>
      <div className="main">
        <Grid fluid>
          <Row center="xs">
            <Col xs={12} lg={6}>
              <h1>Greetings, Admin!</h1>
              <p>What would you like to do?</p>
              <div className="main-btn-wrap">
                <Link to="/send-message">Send a Message</Link>
                <Link to="/settings">Settings</Link>
                <button onClick={() => logoutAdmin()}>Logout</button>
              </div>
            </Col>
          </Row>
        </Grid>
        <div className="data-files">
          <h1>Data Files</h1>
          <Grid fluid center="xs">
            <Row>
              <Col xs={12} lg={6}>
                <div className="excel-box">
                  <h2>Monthly Data</h2>
                  <div className="excel-placeholder"></div>
                  <a>Download</a>
                </div>
              </Col>
              <Col xs={12} lg={6}>
                <div className="excel-box">
                  <h2>All Data</h2>
                  <div className="excel-placeholder"></div>
                  <a>Download</a>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    </Fragment>
  );
}

export default withRouter(Index);