import { useContext, useEffect, useState } from 'react';
import { Button, Col, Image, Modal, Row, Spinner } from 'react-bootstrap';
import AppContext from '../../../AppContext.js';

const ViewProfileModal = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { server, profileModal, setProfileModal } = useContext(AppContext);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (profileModal.userId !== 0) {
      setIsLoading(true);
      fetch(`${server}/profile/${profileModal.userId}`)
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(data => setProfileData(data[0]))
        .catch(err => console.log(`Fetch failed. Error: ${err}`))
        .finally(() => setIsLoading(false));
    }
  }, [server, profileModal]);

  return (
    <Modal
      size="lg"
      centered
      show={profileModal.show}
      onHide={() => setProfileModal({ show: false, userId: 0 })}
    >
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <Row>
            <Col className="text-center">
              <Spinner />
            </Col>
          </Row>
        )}
        {!isLoading && (
          <>
            <Row>
              <Col
                md="auto"
                className="mx-4"
              >
                <Image
                  src={profileData.photo_url}
                  rounded
                  style={{ height: '300px', width: '300px' }}
                />
              </Col>
              <Col className="d-flex flex-column align-items-center justify-content-around">
                <Row className="d-flex align-items-center">
                  <Col md="auto">
                    <Image
                      src={profileData.logo_url}
                      style={{ height: '75px', width: '75px' }}
                    />
                  </Col>
                  <Col>
                    <h4>{profileData.cell_name}</h4>
                  </Col>
                </Row>
                <Row>
                  <h1>
                    {profileData.first_name} {profileData.last_name}
                  </h1>
                </Row>
                <Row>
                  <h2>@{profileData.username}</h2>
                </Row>
                <Row>
                  <Col className="text-center">
                    <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
                    <br />
                    <a href={`tel:${profileData.contact_number1}`}>{profileData.contact_number1}</a>
                    <br />
                    <a href={`tel:${profileData.contact_number2}`}>{profileData.contact_number2}</a>
                    <br />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="m-4">{profileData.bio}</Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setProfileModal({ show: false, userId: 0 })}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewProfileModal;
