import React, {Component} from 'react';
import {render} from 'react-dom';
import Board from './board';
import {itemMap} from "./data";

class App extends Component {

  render() {
    return (
      <Board initial={itemMap} />
    )
  }
}

render(<App/>, document.getElementById('root'));
