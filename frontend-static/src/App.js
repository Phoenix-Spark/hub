import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { Footer, Header } from './components/index.js';
import ViewProfileModal from './components/Modals/ViewProfile/ViewProfileModal.jsx';
import AppContext from './AppContext.js';

import './App.scss';

const frontendUrl = process.env.REACT_APP_FRONTEND_URL || 'https://capstone.apps.jmidd.dev';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [profileModal, setProfileModal] = useState({ show: false, userId: 0 });

  const ContextObject = {
    isDarkMode,
    setIsDarkMode,
    profileModal,
    setProfileModal,
    frontendUrl,
  };

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
