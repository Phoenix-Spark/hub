import React, { useContext } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import AppContext from '../AppContext.js';
import MapChart from '../components/Hub/MapChart.jsx';
import SparkyList from '../components/Hub/SparkyList.jsx';
import { useFetchCells } from './useFetch.js';

function Hub() {
  // const { sparkList } = useContext(AppContext);
  // const [searchQuery, setSearchQuery] = useState('');

  // const handleSearchInputChange = event => {
  //   setSearchQuery(event.target.value);
  // };

  // const filteredSparkList = sparkList.filter(spark => spark.baseName.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  const [data, isLoading, error] = useFetchCells();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="alert">There was an error.</p>;
  }

  return (
    <>
      <Row>
        <Col>
          <h1 className="display-3 m-3">Welcome to Spark Hub!</h1>
        </Col>
      </Row>
      <Row>
        <Col className="mb-3">
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
      <Row>
        <Col
          sm={12}
          md={6}
          className="mb-3"
          style={{ maxHeight: '400px', minHeight: '400px' }}
        >
          <Card className="h-100">
            <Card.Header
              as="h5"
              className="justify-content-between"
            >
              Spark List
            </Card.Header>
            <Card.Body style={{ borderRadius: '10px', height: '75%' }}>
              <SparkyList
                className="h-100"
                sparkList={data}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col
          className="mb-3"
          style={{ maxHeight: '400px', minHeight: '400px' }}
        >
          <Card style={{ height: '100%' }}>
            <Card.Header as="h5">News</Card.Header>
            <Card.Body className="d-flex flex-column h-75"></Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <MapChart sparkList={data} />
        </Col>
      </Row>
    </>
  );
}

export default Hub;
