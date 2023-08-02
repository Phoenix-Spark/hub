import React, { useContext, useEffect, useState } from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import AppContext from '../AppContext.js';
import ProposedProjects from '../components/Dashboard/ProposedProjects.jsx';
import ProfileEditor from '../components/Dashboard/ProfileEditor.jsx';
import UserProjects from '../components/Dashboard/UserProjects.jsx';
import AdminFAQ from '../components/Dashboard/AdminFAQ.jsx';

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
                        <h5 className="mt-4 border-bottom pb-2">Admin Section</h5>
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
                            eventKey="approve-faq"
                            className="link-secondary"
                          >
                            Proposed FAQs
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
                    <Tab.Pane eventKey="approve-faq">
                      <AdminFAQ />
                    </Tab.Pane>
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

export default Dashboard;
