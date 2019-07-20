import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

import CreateRecordView from './components/create-record/CreateRecordView'
// import HomeView from './components/home/HomeView'

function App() {
  return (
    <div className="App">
      <Router>
        {/* <ul>
          <li>
            <Link to="">Home</Link>
          </li>
          <li>
            <Link to="/create-record">Create Record</Link>
          </li>
        </ul> */}
        {/* <Route exact path="/" component={HomeView} /> */}
        {/* <Route path="/create-record" component={CreateRecordView} /> */}
        <Route path="" component={CreateRecordView} />
      </Router>
    </div>
  );
}

export default App;
