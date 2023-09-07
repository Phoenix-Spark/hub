import { useContext, useEffect, useState } from 'react';
import { Button, Col, Image, Modal, Row, Spinner } from 'react-bootstrap';
import AppContext from '../../../AppContext.js';

const ViewProfileModal = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { frontendUrl, server, profileModal, setProfileModal } = useContext(AppContext);
  const [profileData, setProfileData] = useState({});
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (profileModal.userId !== 0) {
      setIsLoading(true);
      fetch(`${server}/user/${profileModal.userId}/profile`)
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(data => setProfileData(data))
        .catch(err => console.log(`Fetch failed. Error: ${err}`))
        .finally(() => setIsLoading(false));
    } else {
      setProfileImage('');
    }
  }, [server, profileModal]);

  useEffect(() => {
    setProfileImage(
      profileData.photoUrl
        ? profileData.photoUrl.startsWith('https')
          ? profileData.photoUrl
          : `${frontendUrl}/uploads/${profileData.photoUrl}`
        : `../images/placeholder_logo.svg`
    );
  }, [profileData]);

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
                  src={profileImage}
                  rounded
                  style={{ height: '300px', width: '300px' }}
                />
              </Col>
              <Col className="d-flex flex-column align-items-center justify-content-around">
                <Row className="d-flex align-items-center">
                  <Col md="auto">
                    <Image
                      src={profileData.cellLogoUrl}
                      style={{ height: '75px', width: '75px' }}
                    />
                  </Col>
                  <Col>
                    <h4>{profileData.cellName}</h4>
                  </Col>
                </Row>
                <Row>
                  <h1>
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                </Row>
                <Row>
                  <h2>@{profileData.username}</h2>
                </Row>
                <Row>
                  <Col className="text-center">
                    <a href={`mailto:${profileData.email}`}>{decodeURIComponent(profileData.email)}</a>
                    <br />
                    <a href={`tel:${profileData.contactNumbers[0]}`}>{profileData?.contactNumbers[0]}</a>
                    <br />
                    <a href={`tel:${profileData.contactNumbers[1]}`}>{profileData?.contactNumbers[1]}</a>
                    <br />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="m-4">
              <Col>
                <p className="text-break">{profileData.bio}</p>
              </Col>
            </Row>
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
