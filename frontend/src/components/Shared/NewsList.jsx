import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/index.js';

function NewsList({ newsList }) {
  return (
    <ListGroup
      style={{ overflowY: 'scroll' }}
      className="h-100"
    >
      {newsList.map((item, index) => (
        <ListGroup.Item
          action
          to={'/'}
          as={Link}
          key={index}
        >
          <Row>
            <Col md="auto">
              <img
                style={{ height: '64px', width: '64px' }}
                src={process.env.PUBLIC_URL + '/images/placeholder_logo.svg'}
                alt=""
              />
            </Col>
            <Col>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{formatDate(new Date(item.date).toString())}</div>
                {item.news}
              </div>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default NewsList;
