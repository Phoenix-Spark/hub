import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from '../AppContext.js';
import { useState, useContext } from 'react';

export default function Hub() {
  const { sparkList } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = event => {
    setSearchQuery(event.target.value);
  };

  const filteredSparkList = sparkList.filter(spark => spark.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mt-5">
      <h3 className="mb-4">This is the Hub Component!</h3>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Spark List</h5>
              <ul className="list-group">
                {filteredSparkList.map((spark, index) => (
                  <li
                    className="list-group-item"
                    key={index}
                  >
                    {spark}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
