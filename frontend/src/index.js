import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import App from './App.js';
import { Cell, Dashboard, Forums, Hub, Project, ProposalForm, ProposedProjects, SignUp, SubmissionFAQ, SubmitNewIdea, KylesCorner, ProposalGuidelines } from './pages/index.js';
import reportWebVitals from './reportWebVitals.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<App />}
    >
      <Route
        index
        element={<Hub />}
      />
      <Route
        path="/cell/:cell_endpoint"
        element={<Cell />}
      />
      <Route
        path="/project/:projectId"
        element={<Project />}
      />
      <Route
        path="/cell/:cell_endpoint/proposed-projects/"
        element={<ProposedProjects />}
      />
      <Route
        path="/cell/:cell_endpoint/new-proposal/"
        element={<ProposalForm />}
      />
      <Route
        path="/signup"
        element={<SignUp />}
      />
      <Route
        path="/dashboard/:page"
        element={<Dashboard />}
      />
      <Route
        path="/SubmissionFAQ"
        element={<SubmissionFAQ />}
      />
       <Route
        path="/SubmitNewIdea"
        element={<SubmitNewIdea />}
      />
      <Route
        path="/KylesCorner"
        element={<KylesCorner />}
      />
      <Route
        path="/forums"
        element={<Forums />}
      />
      <Route
        path="/ProposalGuidelines"
        element={<ProposalGuidelines />}
      />
      <Route
        path="/*"
        element={<Hub />}
      />
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
