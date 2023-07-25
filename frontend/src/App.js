import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './pages/index.js';
import AppContext from './AppContext.js';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button, Navbar } from 'react-bootstrap';

const server = process.env.REACT_APP_SERVER_STRING || 'http://localhost:8080';

export default function App() {
  const [user, setUser] = useState({});
  const [sparkList, setSparkList] = useState([]);

  const ContextObject = { server, user, setUser, sparkList };

  useEffect(() => {
    fetch(`${server}/spark_list`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => setSparkList(data))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, []);

  return (
    <Container
      fluid
      style={{ paddingLeft: 0, paddingRight: 0 }}
      className="app-container-css"
    >
      <AppContext.Provider value={ContextObject}>
        <Container
          fluid
          style={{ paddingLeft: 0, paddingRight: 0 }}
          id="HeaderContainer"
        >
          <Header />
        </Container>
        <Container
          fluid
          style={{ paddingTop: 106}}
          id="BodyContainer"
        >
          <Outlet />
        </Container>
      </AppContext.Provider>
    </Container>
  );
}
