import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SparkyList({ sparkList }) {
  return (
    <ListGroup style={{ height: '100%', overflowY: 'auto' }}>
      {sparkList.map((spark, index) => (
        <ListGroup.Item
          as={Link}
          to={`/cell/${spark.endpoint}`}
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
            <Col className="ms-1 d-flex align-items-center">
              <h3 style={{ display: 'inline' }}>{spark.name}</h3> &nbsp;&nbsp; <strong>@ {spark.baseName}</strong>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default SparkyList;
