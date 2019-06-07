import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

import FileUpload from "./components/Uploader/FileUpload";

function App() {
  return (
    <div className="wrapper">
      <nav className="sidebar"></nav>
      <FileUpload />         
    </div>
  );
}

export default App;
