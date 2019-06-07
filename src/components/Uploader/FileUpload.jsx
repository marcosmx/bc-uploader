import React, { Component } from 'react';
//import {Circle} from 'rc-progress';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './styles.css';

import cloud from '../../upload.svg';
import bcUploading from '../../bclogo.svg';

const { ipcRenderer } = window.require('electron');

const MESSAGES = {
  idle:  'Drop your Video here to Upload',
  loading: 'Upload Progress: ',
  waiting: 'Waiting for asset information ...'
}

class FileUpload extends Component {
  state = {
    loaded: 0,
    total: 0,
    idle: true
  }

  componentDidMount() {
    ipcRenderer.on('upload:progress', (e, data, size) => {
      console.log(data, size);
      this.setState({
        loaded: data.loaded,
        total: size,
        idle: false
      })
    });

    ipcRenderer.on('upload:complete', (e, data, size) => {
      this.setState({
        idle: true,
        loaded: 0,
        total: 0
      })
    });
  }

  showFileWindow() {
    ipcRenderer.send('file:browse');
    this.setState({
      idle: false
    })
  }

  getUploadProgress() {
    if (this.state.total === 0){
       return 0;
    }
    return this.state.loaded*100/this.state.total;
  }

  render() {
    let message = this.state.idle ? MESSAGES.idle : MESSAGES.loading + Math.round(this.getUploadProgress()) + "%"
    const image = this.state.idle ? cloud : bcUploading
    if (this.state.loaded > 0 && this.state.total> 0 && this.state.loaded === this.state.total) {
      message = MESSAGES.waiting;
    }
    const strokeWidth = this.state.idle ? 0 : 2
    return (
      <div className="upload-area text-center">
        <div className="drop-area">
        <CircularProgressbarWithChildren 
          value={this.getUploadProgress()}
          strokeWidth={strokeWidth}
          styles={buildStyles({          
          pathColor: "#35d7e9",
          trailColor: "black"
        })}
        >
          {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
          {/* <img style={{ width: 40, marginTop: -5 }} src="https://i.imgur.com/b9NyUGm.png" alt="doge" /> */}
          <img src={image} alt=""/>
          <p className="message">
            {message}
          </p>
        </CircularProgressbarWithChildren>
        </div>
        <button 
          type="button" 
          className="btn btn-outline-dark btn-file-browser"
          onClick={this.showFileWindow}
        >
        Browse Files
        </button>
      </div>
    );
  }
}

export default FileUpload;