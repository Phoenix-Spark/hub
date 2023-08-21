import { Col, Image, Row } from 'react-bootstrap';
import { useContext } from 'react';
import AppContext from '../../AppContext.js';

import './HorizontalTeamList.scss';

function HorizontalTeamList({ teamList }) {
  const { setProfileModal, frontendUrl } = useContext(AppContext);

  return (
    <Row
      className="justify-content-around"
      id="horizontal-team-list"
    >
      {teamList?.length === 0 && (
        <Col>
          <p>No team members yet.</p>
        </Col>
      )}
      {teamList?.map((member, index) => {
        const imgUrl = member.photo
          ? member.photo.startsWith('https')
            ? member.photo
            : `${frontendUrl}/uploads/${member.photo}`
          : `../images/placeholder_logo.svg`;

        return (
          <Col
            xs="auto"
            key={`${member}-${index}`}
            className="d-flex flex-column align-items-center"
          >
            <Image
              style={{ height: '64px', width: '64px' }}
              src={imgUrl}
              alt="Member Profile"
              onClick={() => {
                console.log(member.id);
                setProfileModal({ show: true, userId: member.id });
              }}
              rounded
              className="mb-1 mx-auto"
            />
            <p className="m-0 text-center lh-1">{member.firstName}</p>
            <p className="m-0 text-center lh-1 mb-2">{member.lastName}</p>
          </Col>
        );
      })}
    </Row>
  );
}
export default HorizontalTeamList;
