import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Container } from 'reactstrap';
import './App.css';
import AppNavbar from './components/AppNavbar';
import PrinterList from './components/PrinterList';
import store from './store';
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <AppNavbar />
          <Container>
            <PrinterList />
          </Container>
        </div>
      </Provider>
    );
  }
}

export default App;
