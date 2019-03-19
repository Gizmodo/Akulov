import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Container } from 'reactstrap';
import './App.css';
import AppNavbar from './components/AppNavbar';
import PrinterList from './components/PrinterList';
class App extends Component {
  render() {
    return (
      <div className="App">
        <AppNavbar />
        <Container>
          <PrinterList />
        </Container>
      </div>
    );
  }
}

export default App;
