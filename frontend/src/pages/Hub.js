import React, { useEffect } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { useState, useContext } from 'react';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button, InputGroup, Navbar, Card, ListGroup } from 'react-bootstrap';
import { DropdownSubmenu, NavDropdownMenu } from 'react-bootstrap-submenu';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import MapChart from '../components/MapChart.js';
import HubNavBar from '../components/HubNavBar.js';

const server = process.env.REACT_APP_SERVER_STRING || 'http://localhost:8080';

function Hub() {
  const { sparkList } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch(`${server}/news`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => setNewsList(data))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, []);

  // const handleSearchInputChange = event => {
  //   setSearchQuery(event.target.value);
  // };

  const filteredSparkList = sparkList.filter(spark => spark.base_name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <>
      <HubNavBar />
      <MissionNewsRow />
      <SparkyList />
      <MapChart />
    </>
  );

  function MissionNewsRow() {
    return (
      <Container
        fluid
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Row className="mt-4 align-items-stretch">
          <Col>
            <Card class="card">
              <Card.Body className="card-body">
                <Card.Title className="card-title">Mission</Card.Title>
                <Card.Text className="border px-3 py-2 mb-0 rounded fw-medium">
                  At the Air Force Spark Hub, our mission is to ignite a culture of innovation and collaboration throughout the Air Force by
                  providing a dynamic and interactive platform that showcases and empowers Spark Cells. We are committed to fostering a
                  thriving ecosystem where Spark Cells can share their groundbreaking ideas, ongoing projects, and achievements, propelling
                  the Air Force into a more agile and forward-thinking future. Through this hub, we aim to connect, inspire, and enable
                  airmen from all ranks to contribute, propose, and collaborate on transformative initiatives that drive technological
                  advancements and enhance the Air Force's operational capabilities. Together, we spark the flames of ingenuity, propelling
                  the Air Force to new heights of excellence and ensuring our nation's defense remains unrivaled.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col class="h-100">
            <Card class="card h-100">
              <Card.Body className="card-body">
                <Card.Title className="card-title">News</Card.Title>
                <ListGroup
                  className="list-group"
                  style={{ height: '275px', overflowY: 'scroll' }}
                >
                  {newsList.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="list-group-item"
                    >
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <img
                            style={{ height: '64px', width: '64px' }}
                            src="./images/placeholder_logo.svg"
                            alt=""
                          />
                        </div>
                        <div class="col">
                          <p>{item.date}</p>
                          <p>{item.news}</p>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  function SparkyList() {
    return (
      <Container
      fluid
      style={{ paddingLeft: 0, paddingRight: 0 }}
    >
      <div className="row mt-4 mx-1">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Spark List</h5>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <ul className="list-group">
                {filteredSparkList.map((spark, index) => (
                  <a
                    href={`/cell/`}
                    key={index}
                    className="list-group-item list-group-item-action"
                  >
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <img
                          style={{ height: '64px', width: '64px' }}
                          src={spark.logo_url}
                          alt=""
                        />
                      </div>
                      <div class="col pl-5">
                        {spark.cell_name} at {spark.base_name}
                      </div>
                    </div>
                  </a>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      </Container>
    );
  }
}

export default Hub;
