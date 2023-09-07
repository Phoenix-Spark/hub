import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SparkyList({ sparkList }) {
  return (
    <ListGroup style={{ height: '100%', overflowY: 'auto' }}>
      {sparkList.map((spark, index) => {
        const imgUrl = spark.logo_url
          ? spark.logo_url.startsWith('https')
            ? spark.logo_url
            : `${window.location.origin}/hub${spark.logo_url}`
          : `${window.location.origin}/hub/images/placeholder_logo.svg`;

        return (
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
                  src={imgUrl}
                  alt=""
                />
              </Col>
              <Col className="ms-1 d-flex align-items-center">
                <h3 style={{ display: 'inline' }}>{spark.name}</h3> &nbsp;&nbsp; <strong>@ {spark.base.name}</strong>
              </Col>
            </Row>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default SparkyList;
