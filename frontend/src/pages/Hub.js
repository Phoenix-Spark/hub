import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

import AppContext from '../AppContext.js';
import MapChart from '../components/Hub/MapChart.jsx';
import SparkyList from '../components/Hub/SparkyList.jsx';
import { NewsList } from '../components/index.js';

function Hub() {
  const { server, sparkList } = useContext(AppContext);
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
      <Row className="mt-3">
        <Col>
          <Card>
            <Card.Header as="h5">Mission</Card.Header>
            <Card.Body style={{ borderRadius: '10px' }}>
              <Card.Text className="border px-3 py-2 mb-0 rounded fw-medium">
                At the Air Force Spark Hub, our mission is to ignite a culture of innovation and collaboration throughout the Air Force by
                providing a dynamic and interactive platform that showcases and empowers Spark Cells. We are committed to fostering a
                thriving ecosystem where Spark Cells can share their groundbreaking ideas, ongoing projects, and achievements, propelling
                the Air Force into a more agile and forward-thinking future. Through this hub, we aim to connect, inspire, and enable airmen
                from all ranks to contribute, propose, and collaborate on transformative initiatives that drive technological advancements
                and enhance the Air Force's operational capabilities. Together, we spark the flames of ingenuity, propelling the Air Force
                to new heights of excellence and ensuring our nation's defense remains unrivaled.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="my-3">
        <Col
          sm={12}
          md={6}
          style={{ maxHeight: '400px', minHeight: '400px' }}
        >
          <Card className="h-100">
            <Card.Header
              as="h5"
              className="justify-content-between"
            >
              Spark List
              <Button
                variant="secondary"
                href="http://localhost:3000/"
                className=""
              >
                Don't see your cell?
              </Button>
            </Card.Header>
            <Card.Body style={{ borderRadius: '10px' }}>
              <SparkyList sparkList={filteredSparkList} />
            </Card.Body>
          </Card>
        </Col>
        <Col style={{ maxHeight: '400px', minHeight: '400px' }}>
          <Card style={{ height: '100%' }}>
            <Card.Header as="h5">News</Card.Header>
            <Card.Body className="d-flex flex-column h-75">
              <NewsList newsList={newsList} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <MapChart />
        </Col>
      </Row>
    </>
  );
}

export default Hub;
