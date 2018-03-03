import React, {Component} from 'react';
import {render} from 'react-dom';
import Board from './elements/board';
import {itemMap} from "./data";
import {Provider as AlertProvider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import "./styles.scss"


const options = {
  position: 'bottom center',
  timeout: 5000,
  offset: '30px',
  transition: 'scale'
};

class App extends Component {

  render() {
    return (
      <AlertProvider template={AlertTemplate} {...options}>
        <Board initial={itemMap}/>
      </AlertProvider>
    )
  }
}

render(<App/>, document.getElementById('root'));
