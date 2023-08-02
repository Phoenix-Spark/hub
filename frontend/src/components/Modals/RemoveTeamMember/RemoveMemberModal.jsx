import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Image, Modal, Row, ListGroup } from 'react-bootstrap';

const RemoveMemberModal = ({isModalShowing, hideModal, refreshMemberList, server, memberList, projectId}) => {
  const [isLoading, setIsLoading] = useState(false);


  const handleRemoveMembers = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append('projectId', projectId);

    console.log(formData.has('member'));

    if (formData.has('member')) {
      // send removal request
      const response = await fetch(`${server}/project/${projectId}/team/remove`, {
        method: "DELETE",
        credentials: "include",
        body: formData,
      });

      console.log(response);
      if (response.ok) {
        refreshMemberList(prev => prev + 1);
        setIsLoading(false);
        hideModal();
      }

    } else {
      console.log('no one was selected');
      setIsLoading(false);
    }
  }

  return (
    <Modal
      size="sm"
      centered
      show={isModalShowing}
      onHide={hideModal}
    >
      <Form onSubmit={handleRemoveMembers}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Member(s)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <p>Select the member(s) to remove.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup as="ul">
                {memberList.length > 0 && memberList.map(member => (
                  <ListGroup.Item as="li">
                    <input type="checkbox" className="btn-check" name="member" value={member.id} id={`member-${member.id}`}/>
                    <label className="btn btn-outline-secondary w-100 text-start border-0" htmlFor={`member-${member.id}`}>
                      <Image src={member.photo} width="47" className="me-2 border border-black" />
                      {`${member.firstName} ${member.lastName}`}
                    </label>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button
            variant="secondary"
            onClick={hideModal}
          >
            Close
          </Button>
              <Button type="submit" variant="danger" disabled={isLoading}>Remove Members</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RemoveMemberModal;
