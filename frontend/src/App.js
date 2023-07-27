import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import * as jose from 'jose';
import { Outlet } from 'react-router-dom';
import { Header } from './pages/index.js';
import AppContext from './AppContext.js';
import { Container } from 'react-bootstrap';

const server = process.env.REACT_APP_SERVER_STRING || 'http://localhost:8080';

export default function App() {
  const [user, setUser] = useState(null);
  const [sparkList, setSparkList] = useState([]);
  const [showLogin, setShowLogin] = useState(true);

  const ContextObject = { server, user, setUser, sparkList, showLogin, setShowLogin };

  useEffect(() => {
    let ignore = false;

    const fetchSparkList = async () => {
      try {
        const response = await fetch(`${server}/spark_list`);
        const data = await response.json();
        if (!ignore) {
          setSparkList(data);
        }
      } catch (e) {
        console.error('Fetch failed. ', e);
      }
    };

    const checkUserSession = async () => {
      try {
        const response = await fetch(`${server}/user/refresh`, {
          credentials: 'include',
        });

        // verify jwt
        if (response.ok) {
          const data = await response.json();
          const secret = process.env.REACT_APP_SECRET || 'secret';
          const secretUInt = new TextEncoder().encode(secret);
          const { payload } = await jose.jwtVerify(data.token, secretUInt, {
            issuer: 'capstone',
          });

          for (let key of Object.keys(payload.user)) {
            payload.user[key] = decodeURIComponent(payload.user[key]);
          }

          setUser(payload.user);
        }
      } catch (e) {
        console.error('There was an error checking user session. ', e);
      }
    };

    checkUserSession();
    fetchSparkList();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AppContext.Provider value={ContextObject}>
      <Header />
      <Container
        fluid
        style={{ paddingTop: 105 }}
        className="bg-body-secondary"
        id="BodyContainer"
      >
        <Outlet />
      </Container>
    </AppContext.Provider>
  );
}
