import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SparkyList({ sparkList }) {
  return (
    <ListGroup style={{ maxHeight: '25vh', overflowY: 'auto' }}>
      {sparkList.map((spark, index) => (
        <ListGroup.Item
          as={Link}
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
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default SparkyList;
