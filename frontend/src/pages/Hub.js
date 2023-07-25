import React, { useEffect } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { useState, useContext } from 'react';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button, InputGroup, Navbar } from 'react-bootstrap';
import { DropdownSubmenu, NavDropdownMenu } from 'react-bootstrap-submenu';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import MapChart from './MapChart.js';

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
      .then(data => {
        if (Array.isArray(data)) {
          setNewsList(data);
        } else {
          console.error("Data is not an array:", data);
          setNewsList([]); // Set an empty array or handle the data not in the expected format
        }
      });
  }, []);

  // const handleSearchInputChange = event => {
  //   setSearchQuery(event.target.value);
  // };

  const filteredSparkList = sparkList.filter(spark => spark.base_name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <>
      <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Navbar
          className="bg-body-tertiary"
          data-bs-theme="dark"
        >
          <Form
            fluid
            className="col-sm-12 col-md-12 col-lg-12 justify-content-center"
          >
            <Row>
              <Col className="mx-3 col-sm-14 col-md-4 col-lg-4">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className=" mr-sm-2"
                />
              </Col>
              <Col xs="auto" className='col-sm-1 col-md-1 col-lg-1'>
                <Button
                  variant="dark"
                  type="submit"
                >
                  Submit
                </Button>
              </Col>
              <Col xs="auto" className="my-1 col-sm-1 col-md-1 col-lg-1">
                <NavDropdownMenu title="Resources">
                  <NavDropdown.Item href="http://localhost:3000/">Proposal Guidelines</NavDropdown.Item>
                </NavDropdownMenu>
              </Col>
              <Col xs="auto">
                <Button
                  variant="dark"
                  href="http://localhost:3000/"
                >
                  Forum
                </Button>
              </Col>
              <Col xs="auto" className="mx-3 text-nowrap">
                <Button
                  variant="dark"
                  href="http://localhost:3000/"
                >
                  Don't see your cell?
                </Button>
              </Col>
            </Row>
          </Form>
        </Navbar>
      </Container>

      <MissionNewsRow />
      <SparkyList />
      <MapChart />
    </>
  );

  function MissionNewsRow() {
    return (
      <div className="row mt-4 d-flex flex-column flex-sm-row">
        <div className="col-md-6 d-flex">
          <div class="card flex-grow-1">
            <div className="card-body">
              <h5 className="card-title pl-5">Mission</h5>
              <p className="border px-3 py-2 mb-0 rounded fw-medium">
                At the Air Force Spark Hub, our mission is to ignite a culture of innovation and collaboration throughout the Air Force by
                providing a dynamic and interactive platform that showcases and empowers Spark Cells. We are committed to fostering a thriving
                ecosystem where Spark Cells can share their groundbreaking ideas, ongoing projects, and achievements, propelling the Air Force
                into a more agile and forward-thinking future. Through this hub, we aim to connect, inspire, and enable airmen from all ranks to
                contribute, propose, and collaborate on transformative initiatives that drive technological advancements and enhance the Air
                Force's operational capabilities. Together, we spark the flames of ingenuity, propelling the Air Force to new heights of
                excellence and ensuring our nation's defense remains unrivaled.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-6 d-flex">
          <div class="card flex-shrink-1">
            <div className="card-body">
              <h5 className="card-title pl-5">News</h5>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <ul className="list-group">
                  {newsList.map((item, index) => (
                    <li
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
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function SparkyList() {
    return (
      <div className="row mt-4 mx-1">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Spark List</h5>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <ul className="list-group">
                {filteredSparkList.map((spark, index) => (
                  <a
                    href ={`/cell/`}
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
    );
  }
}

export default Hub;