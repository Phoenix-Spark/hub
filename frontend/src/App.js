import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Hub, Cell, Project } from './pages/index.js';
export const AppContext = createContext();

const server = process.env.REACT_APP_SERVER_STRING || "http://localhost:8080";

export default function App() {
  const [user, setUser] = useState({})
  const [sparkList, setSparkList] = useState([])

  const ContextObject = { server, user, setUser, sparkList}

  useEffect(() => {
    fetch(`${server}/spark_list`)
        .then(res=>{console.log(res);
                    return res.json();})
        .then(data=>setSparkList(data))
        .catch(err=>console.log(`Fetch failed. Error: ${err}`))
  }, []);

  return (
    <div id="AppWrapper">
      <AppContext.Provider value={ContextObject}>
        <BrowserRouter>
          <div id="HeaderContainer"><Header /></div>
          <div id="BodyContainer">
            <Routes>
              <Route path='/' element={<Hub />} />
              <Route path='/cell/*' element={<Cell />} />
              <Route path='/project/*' element={<Project />} />
              <Route path='/*' element={<Hub />} /> {/*catch all*/}
            </Routes>
          </div>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}