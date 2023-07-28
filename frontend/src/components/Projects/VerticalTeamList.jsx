import { Col, ListGroup, Row } from 'react-bootstrap';

function VerticalTeamList({ team }) {
  return (
    <ListGroup style={{ overflowY: 'auto' }}>
      {team?.map((item, index) => {
        const imgUrl = item.photo_url
          ? item.photo_url.startsWith('https')
            ? item.photo_url
            : `http://localhost:3000/uploads/${item.photo_url}`
          : `../images/placeholder_logo.svg`;
        return (
          <ListGroup.Item
            action
            key={index}
          >
            <Row>
              <Col md="auto">
                <img
                  style={{ height: '64px', width: '64px' }}
                  src={imgUrl}
                  alt=""
                />
              </Col>
              <Col>
                <div style={{ fontWeight: 'bold' }}>
                  {item.first_name} {item.last_name}
                </div>
              </Col>
            </Row>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default VerticalTeamList;
