import { Button, Card, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import AppContext from '../AppContext.js';
import PhotoCarousel from '../components/Projects/PhotoCarousel.jsx';
import VerticalTeamList from '../components/Projects/VerticalTeamList.jsx';
import AddMemberModal from '../components/Modals/AddTeamMember/AddMemberModal.jsx';
import RemoveMemberModal from '../components/Modals/RemoveTeamMember/RemoveMemberModal.jsx';

export default function Project() {
  const { server, user } = useContext(AppContext);
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [potentialMemberList, setPotentialMemberList] = useState([]);
  const [addMemberModalShowing, setAddMemberModalShowing] = useState(false);
  const [remMemberModalShowing, setRemMemberModalShowing] = useState(false);
  const [refreshTeamList, setRefreshTeamList] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const response = await fetch(`${server}/project/${projectId}/all`);
        if (response.ok) {
          const data = await response.json();
          if (!ignore) {
            setProjectData(data)
            setTeamList(data.team)
          }
        }
      } catch (e) {
        throw new Error(`There was an error. ${e}`);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const response = await fetch(`${server}/project/${projectId}/team`);
        if (response.ok) {
          const data = await response.json();
          if (!ignore) setTeamList(data);
        }
      } catch (e) {
        throw new Error(`There was an error. ${e}`);
      }
    };

    if (refreshTeamList > 0) fetchData();

    return () => {
      ignore = true;
    };
  }, [refreshTeamList])

  const handleAddMember = async () => {
    try {
    const response = await fetch(`${server}/cell/${projectData.cell_id}/team`);
    if (response.ok) {
      const data = await response.json();
      let potentialTeam = new Set();
      
      // This is a convoluted way to compare the two lists and only add members not already a part of team
      let found = false;
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < projectData.team.length; j++) {
          if (data[i].id === projectData.team[j].id) {
            found = true;
            break;
          } else {
            found = false
          }
        }
        if(!found) potentialTeam.add(data[i]);
      }

      potentialTeam.forEach((val, key, set) => {

      });

      setPotentialMemberList(prev => new Set(potentialTeam));
      showAddMemberModal(true);

    }
   } catch (e) {
    console.error(`There was an error. ${e}`);
   }
  }

  const handleRemoveMember = () => {
    showRemMemberModal(true);
  }

  const showAddMemberModal = () => {setAddMemberModalShowing(true)}
  const hideAddMemberModal = () => {setAddMemberModalShowing(false)}
  const showRemMemberModal = () => {setRemMemberModalShowing(true)}
  const hideRemMemberModal = () => {setRemMemberModalShowing(false)}

  return (
    <>
      <Row className="my-3">
        <Col>
          <Card>
            <Card.Header as="h5">{projectData?.name} Overview</Card.Header>
            <Card.Body className="d-flex flex-column h-100">{projectData?.description}</Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={3}>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              Team
              {(user?.roles === 'site' || user?.roles === 'cell') && (
                <DropdownButton title="Manage Team">
                  <Dropdown.Item onClick={handleAddMember}>Add Member(s)</Dropdown.Item>
                  <Dropdown.Item onClick={handleRemoveMember}>Remove Member(s)</Dropdown.Item>
                </DropdownButton>
              )}
            </Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              {projectData.team?.length > 0 ? <VerticalTeamList team={teamList}></VerticalTeamList> : <p>No team yet.</p>}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card
            className="h-100"
          >
            <Card.Header className="d-flex justify-content-between">Photos{(user?.roles === 'site' || user?.roles === 'cell') && <Button>Add Photos</Button>}</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              {projectData.photos?.length > 0 ? <PhotoCarousel photos={projectData?.photos}></PhotoCarousel> : <p>No Photos to show</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="">
        <Col>
          <Card>
            <Card.Header>Budget</Card.Header>
            <Card.Body className="d-flex flex-column h-100">
              <p>${projectData?.budget}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AddMemberModal isModalShowing={addMemberModalShowing} hideModal={hideAddMemberModal} memberList={potentialMemberList} server={server} projectId={projectData.id} refreshMemberList={setRefreshTeamList} />
      <RemoveMemberModal isModalShowing={remMemberModalShowing} hideModal={hideRemMemberModal} memberList={teamList} server={server} projectId={projectData.id} refreshMemberList={setRefreshTeamList} />
    </>
  );
}
