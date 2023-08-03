import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React from 'react';

import {firstSentence} from '../../utils/index.js';



function ProjectList({ projects }) {
  return (
    <ListGroup style={{ overflowY: 'auto' }}>
      {projects?.length === 0 && 'No Projects to show.'}
      {projects?.map((item, index) => (
        <ListGroup.Item
          action
          as={Link}
          to={`/project/${item.id}`}
          key={index}
        >
          <Row>
            <Col md="auto">
              <img
                style={{ height: '64px', width: '64px' }}
                src="../images/placeholder_logo.svg"
                alt=""
              />
            </Col>
            <Col>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                {firstSentence(item.description)}
              </div>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
export default ProjectList;
