import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './pages/index.js';
import AppContext from './AppContext.js';

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
    <div id="AppWrapper">
      <AppContext.Provider value={ContextObject}>
        <div id="HeaderContainer">
          <Header />
        </div>
        <div id="BodyContainer">
          <Outlet />
        </div>
      </AppContext.Provider>
    </div>
  );
}
