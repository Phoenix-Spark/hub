import { Col, Image } from 'react-bootstrap';
import React from 'react';

function HorizontalTeamList({ teamList }) {
  return (
    <>
      {teamList.map((member, index) => {
        const imgUrl = member.photo_url
          ? member.photo_url.startsWith('https')
            ? member.photo_url
            : `http://localhost:3000/uploads/${member.photo_url}`
          : `../images/placeholder_logo.svg`;
        return (
          <Col
            md="auto"
            key={`${member}-${index}`}
          >
            <Image
              style={{ height: '64px', width: '64px' }}
              src={imgUrl}
              alt="Member Profile"
              rounded
            />
            <br />
            {member.first_name} {member.last_name}
          </Col>
        );
      })}
    </>
  );
}
export default HorizontalTeamList;
