import React, { Component } from 'react';
import './App.css';
import AppNavbar from './components/AppNavbar';
class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Hello</h1>
        <AppNavbar />
      </div>
    );
  }
}

export default App;
