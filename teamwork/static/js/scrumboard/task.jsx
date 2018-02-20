import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import {grid} from './constants';

const Container = styled.div`
  margin-bottom: ${grid}px;
  border: 1px solid grey;
  border-radius: 2px;
  padding: ${grid}px;
`;


export default class Task extends Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.pk}>
      {(provided, snapshot) => (
        <Container>
          {this.props.task.fields.title}
        </Container>
      )}
      </Draggable>
    )
  }
}
