import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContext } from '../AppContext.js';
import { useState, useEffect, useContext } from 'react';

export default function Cell() {
  const { server } = useContext(AppContext);
  const [cellData, setCellData] = useState({});

  let cellId = 1;

  useEffect(() => {
    fetch(`${server}/cell/${cellId}`)
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(data => setCellData(data[0]))
      .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, [server, cellId]);

  return (
    <>
      <div>This is the Cell Component!</div>
      <br />
      {JSON.stringify(cellData)}
    </>
  );
}
