import React, { useState, useContext, useEffect } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button, InputGroup, Navbar, Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
      hour12: false
    };
    let formattedDate = date.toLocaleString('en-US', options);
    formattedDate = formattedDate.replace('24:00', '00:00');

    return formattedDate;
  };

  function MissionNewsRow() {
    const [missionCardHeight, setMissionCardHeight] = useState('600px');

    useEffect(() => {
      function handleResize() {
        const height = document.getElementById('mission-card') ? `${document.getElementById('mission-card').clientHeight + 2}px` : '600px';
        setMissionCardHeight(height);
      }
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    return (
      <Container
        fluid
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Row className="mt-4 align-items-stretch">
          <Col>
            <Card id="mission-card">
              <Card.Body style={{ backgroundColor: '#F4F4F4', borderRadius: '10px' }}>
                <Card.Title className="card-title">Mission</Card.Title>
                <Card.Text
                  className="border px-3 py-2 mb-0 rounded fw-medium"
                  style={{ backgroundColor: '#FCFCFC' }}
                >
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
          <Col>
            <Card style={{ height: missionCardHeight, backgroundColor: '#F4F4F4' }}>
              <Card.Body className="d-flex flex-column h-100">
                <Card.Title>News</Card.Title>
                <ListGroup style={{ overflowY: 'auto' }}>
                  {newsList.map((item, index) => (
                    <ListGroup.Item
                      action
                      to={'/'}
                      as={Link}
                      key={index}
                      // style={{ backgroundColor: '#FCFCFC' }} This breaks the nice on hover effect... stretch goal
                    >
                      <Row>
                        <Col md="auto">
                          <img
                            style={{ height: '64px', width: '64px' }}
                            src="./images/placeholder_logo.svg"
                            alt=""
                          />
                        </Col>
                        <Col>
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: "bold" }}>{formatDate(new Date(item.date).toString())}</div>
                            {item.news}
                          </div>
                        </Col>
                      </Row>
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
        style={{ paddingLeft: 12, paddingRight: 12 }}
      >
        <Row className="mt-4">
          <Card>
            <Card.Body>
              <Card.Title>Spark List</Card.Title>
              <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filteredSparkList.map((spark, index) => (
                  <Link
                    to={`/cell/${spark.cell_endpoint}`}
                    key={index}
                    className="list-group-item list-group-item-action"
                  >
                    <Row>
                      <Col md="auto">
                        <img
                          style={{ height: '64px', width: '64px' }}
                          src={spark.logo_url}
                          alt=""
                        />
                      </Col>
                      <Col className="pl-5">
                        {spark.cell_name} at {spark.base_name}
                      </Col>
                    </Row>
                  </Link>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    );
  }
}

export default Hub;
