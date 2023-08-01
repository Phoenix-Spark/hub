import React, { useContext, useEffect, useState, useRef } from 'react';
import { Col, Nav, Row, Tab, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import AppContext from '../AppContext.js';
import ProposedProjects from '../components/Dashboard/ProposedProjects.jsx';
import ProfileEditor from '../components/Dashboard/ProfileEditor.jsx';
import UserProjects from '../components/Dashboard/UserProjects.jsx';

import './Dashboard.scss';
import CellDetails from '../components/Dashboard/CellDetails.jsx';

function Dashboard() {
  const currentPage = useParams();
  const navigate = useNavigate();
  const { server, user } = useContext(AppContext);
  const [activeKey, setActiveKey] = useState('account');
  const [refreshProjectList, setRefreshProjectList] = useState(0);

  useEffect(() => {
    setActiveKey(currentPage.page);
  }, [currentPage]);

  const displayRoles = () => {
    if (user) {
      if (user.roles === 'cell') {
        return 'Cell Admin';
      } else if (user.roles === 'site') {
        return 'Site Admin';
      }
    }
  };

  const handleTabSelect = key => {
    console.log(key);
    navigate(`/dashboard/${key}`);
  };

  return (
    <>
      {user && (
        <Row className="my-3">
          <Col>
            <h1 className="border-bottom pb-2">
              {user?.firstName}'s Dashboard {user.roles && <small>- {displayRoles()}</small>}
            </h1>
            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey={currentPage.page}
              activeKey={activeKey}
              onSelect={handleTabSelect}
            >
              <Row>
                <Col sm={3}>
                  <Nav
                    variant="underline"
                    className="flex-column"
                  >
                    <Nav.Item>
                      <Nav.Link
                        eventKey="account"
                        className="link-secondary"
                      >
                        Account Settings
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="projects"
                        className="link-secondary"
                      >
                        Your Projects
                      </Nav.Link>
                    </Nav.Item>
                    {(user?.roles === 'site' || user?.roles === 'cell') && (
                      <>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="proposed-projects"
                          className="link-secondary"
                        >
                          Proposed Projects
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="cell-details"
                          className="link-secondary"
                        >
                          Cell Details
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="admin-things"
                          className="link-secondary"
                        >
                          Admin Things
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                        eventKey="admin-faq"
                        className="link-secondary"
                        >
                        Admin-FAQ
                        </Nav.Link>
                      </Nav.Item>
                    </>
                    )}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content className="border-start p-3">
                    <Tab.Pane eventKey="account">
                      Tab with form for user to edit their profile things.
                      <ProfileEditor />
                    </Tab.Pane>
                    <Tab.Pane eventKey="projects">
                      <UserProjects
                        refreshProjectList={refreshProjectList}
                        setRefreshProjectList={setRefreshProjectList}
                      ></UserProjects>
                    </Tab.Pane>
                    <Tab.Pane eventKey="proposed-projects">
                      {user.roles && (
                        <ProposedProjects
                          refreshProjectList={refreshProjectList}
                          setRefreshProjectList={setRefreshProjectList}
                          cell={user?.cellId ?? undefined}
                        />
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="cell-details">
                      <CellDetails></CellDetails>
                    </Tab.Pane>
                    <Tab.Pane eventKey="admin-things">All the admin things here to add cells, approve projects, and manage users</Tab.Pane>
                    <Tab.Pane eventKey="admin-faq"><AdminFAQ/></Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Col>
        </Row>
      )}
    </>
  );
}

function AdminFAQ() {
  const { server, user } = useContext(AppContext);
  const [ newQuestions, setNewQuestions ] = useState([]);
  const [ refresh, setRefresh ] = useState(false);
  const renderCounter  = useRef(0);
    renderCounter.current = renderCounter.current + 1;

  useEffect(()=>{
    fetch(`${server}/faq/new`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => {setNewQuestions(data);console.log(data)})
      .then(setRefresh(false))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  },[refresh])

  const handleSubmit = (e, faqId) => {
    e.preventDefault();
    console.log(e.currentTarget.formAnswer.value)
    fetch(`${server}/faq/${faqId}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify({answer: e.currentTarget.formAnswer.value, answered_by: user.id})
    })
    .then(res=>console.log("submit", res))
    .then(setRefresh(true))//truing this triggers useEffect to fetch again.
  }

  const handleDelete = (faqId) => {
    fetch(`${server}/faq/${faqId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })
    .then(console.log("delete"))
    .then(setRefresh(true))//truing this triggers useEffect to fetch again.
  }

  return(
    <>
      <h2>Submitted FAQ Questions: Renders: {renderCounter.current}</h2>
      {newQuestions.map((question)=>
        <>
          <Card className="mt-4">
            <Card.Header as="h5" className="d-flex justify-content-between">
              <span>{question.question}</span>
              <span>
                <Button variant="danger" className='me-3' onClick={()=>handleDelete(question.id)}>
                  Delete
                </Button>
                FAQ Id: {question.id}
              </span>
            </Card.Header>
            <Card.Body style={{ borderRadius: '10px' }}>
              <Form onSubmit={(e)=>handleSubmit(e,question.id)}>
                <Form.Group controlId="formAnswer">
                  <Form.Label>
                    <h6>Answer</h6>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your answer"
                    name="formAnswer"
                    // value=''
                    // onChange={handleQuestionChange}
                  />
                </Form.Group>
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  )
}

export default Dashboard;