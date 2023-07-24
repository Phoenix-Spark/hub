import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { useContext } from 'react';

export default function Hub() {
  const { sparkList } = useContext(AppContext);

  return (
    <>
      <div>This is the Hub Component!</div>
      <br />
      {JSON.stringify(sparkList)}
    </>
  );
}
