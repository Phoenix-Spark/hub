import React, { useContext, useEffect, useState } from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import AppContext from '../AppContext.js';
import ProposedProjects from '../components/Dashboard/ProposedProjects.jsx';

import './Dashboard.scss';
import UserProjects from '../components/Dashboard/UserProjects.jsx';

function Dashboard() {
  const currentPage = useParams();
  const { user } = useContext(AppContext);
  const [activeKey, setActiveKey] = useState('account');

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
              onSelect={k => setActiveKey(k)}
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
                        {(user?.roles === 'site' || user?.roles === 'cell') && 'Proposed '}Projects
                      </Nav.Link>
                    </Nav.Item>
                    {(user?.roles === 'site' || user?.roles === 'cell') && (
                      <Nav.Item>
                        <Nav.Link
                          eventKey="admin-things"
                          className="link-secondary"
                        >
                          Admin Things
                        </Nav.Link>
                      </Nav.Item>
                    )}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content className="border-start p-3">
                    <Tab.Pane eventKey="account">Tab with form for user to edit their profile things.</Tab.Pane>
                    <Tab.Pane eventKey="projects">
                      {!user.roles ? <UserProjects /> : <ProposedProjects cell={user?.cellId ?? undefined} />}
                    </Tab.Pane>
                    <Tab.Pane eventKey="admin-things">All the admin things here to add cells, approve projects, and manage users</Tab.Pane>
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
