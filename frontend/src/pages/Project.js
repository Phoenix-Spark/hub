import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContext } from '../AppContext.js';
import { useState, useEffect, useContext } from 'react';

export default function Project() {
  const { server } = useContext(AppContext);
  const [projectData, setProjectData] = useState({});

  let projectId = 1;

  useEffect(() => {
    fetch(`${server}/project/${projectId}`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => setProjectData(data[0]))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, [server, projectId]);

  return (
    <>
      <div>This is the Project Component!</div>
      <br />
      {JSON.stringify(projectData)}
    </>
  );
}
