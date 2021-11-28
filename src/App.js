import React, { Component } from 'react';
import logo1 from './img/logo1.png';
import logo2 from './img/logo2.png';
import './App.css';
import { render } from 'react-dom';


export default class App extends Component {

  constructor() {
    super();
    this.state = {
      site: '',
      job: '',

    };
    //SITE SELECTION
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    //JOB SELECTION
    this.handleJobSelect = this.handleJobSelect.bind(this);
    this.handleJobSubmit = this.handleJobSubmit.bind(this);
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({ site: event.target.value });
  }

  handleSubmit(event) {

    event.preventDefault();
    console.log(this.state.site);

  }

  handleJobSelect(event) {
    this.setState({ job: event.target.value });
  }

  handleJobSubmit(event) {
    event.preventDefault();
    console.log(this.state.job);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">

          <img src={logo1} className="App-logo" alt="logo" />
          <img src={logo2} className="App-logo" alt="logo" />

        </header>

        <h2>
          Please select what site are you from?
        </h2>

        &nbsp;

        <form onSubmit={this.handleSubmit}>

          <label>
            <input
              type="radio"
              value="HAR"
              checked={this.state.site === "HAR"}
              onChange={this.handleChange}
            />HAR
          </label>

          <span className="space-between-radio" ></span>

          <label>
            <input
              type="radio"
              value="GER"
              checked={this.state.site === "GER"}
              onChange={this.handleChange}
            />GER
          </label>

          <span className="space-between-radio" ></span>

          <label>
            <input
              type="radio"
              value="OHA"
              checked={this.state.site === "OHA"}
              onChange={this.handleChange}
            />OHA
          </label>

          <span className="space-between-radio" ></span>

          <label>
            <input
              type="radio"
              value="REP"
              checked={this.state.site === "REP"}
              onChange={this.handleChange}
            />REP
          </label>

          <span className="space-between-radio" ></span>

        </form>



      </div>
    );
  }
}

