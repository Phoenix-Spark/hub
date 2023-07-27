import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Cell, Hub, Login, Project, ProposedProjects, ProposalForm, SignUp, Dashboard } from './pages/index.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<App />}>
        <Route index
        element={<Hub />} />
        <Route path='/cell/:cell_endpoint'
        element={<Cell />} />
        <Route path='/project/:projectId'
        element={<Project />} />
        <Route path='/cell/:cell_endpoint/proposed-projects/'
        element={<ProposedProjects />} />
        <Route path='/cell/:cell_endpoint/new-proposal/'
        element={<ProposalForm />} />
        <Route
          path="/login"
          element={<Login />} />
        <Route
          path="/signup"
          element={<SignUp />} />
        <Route path='/*'
        element={<Hub />} />
        <Route path='/dashboard'
        element={<Dashboard />} />
    </Route>
  )
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
