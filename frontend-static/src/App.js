import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { Footer, Header } from './components/index.js';
import ViewProfileModal from './components/Modals/ViewProfile/ViewProfileModal.jsx';
import AppContext from './AppContext.js';

import './App.scss';

// const server = process.env.REACT_APP_SERVER_ADDRESS || 'http://localhost:8080';
const frontendUrl = process.env.REACT_APP_FRONTEND_URL || 'https://capstone.apps.jmidd.dev';

export default function App() {
  // const [sparkList, setSparkList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [profileModal, setProfileModal] = useState({ show: false, userId: 0 });

  const ContextObject = {
    // server,
    // sparkList,
    isDarkMode,
    setIsDarkMode,
    profileModal,
    setProfileModal,
    frontendUrl,
  };

  // useEffect(() => {
  //   let ignore = false;
  //
  //   const fetchSparkList = async () => {
  //     try {
  //       const response = await fetch(`${server}/cell/list?include=bases`);
  //       const data = await response.json();
  //       if (!ignore) {
  //         setSparkList(data);
  //       }
  //     } catch (e) {
  //       console.error('Fetch failed. ', e);
  //     }
  //   };
  //
  //   // fetchSparkList();
  //
  //   return () => {
  //     ignore = true;
  //   };
  // }, []);

  return (
    <AppContext.Provider value={ContextObject}>
      <Header />
      <div className="scrollbar-morpheus-den">
        <Container
          fluid
          style={{ paddingTop: 105 }}
          className="bg-body-secondary col-12 col-md-10 pb-5"
          id="BodyContainer"
        >
          <Outlet />
        </Container>
      </div>
      <ViewProfileModal />
      <Footer />
    </AppContext.Provider>
  );
}
