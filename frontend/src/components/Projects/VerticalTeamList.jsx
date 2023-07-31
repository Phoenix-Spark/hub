import { Col, ListGroup, Row } from 'react-bootstrap';
import { useContext } from 'react';
import AppContext from '../../AppContext.js';

function VerticalTeamList({ team }) {
    const { setProfileModal } = useContext(AppContext);

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
                  onClick={()=>setProfileModal({show: true, userId: item.id})}
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
