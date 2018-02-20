import React, {Component} from 'react';
import {Droppable, Props, State} from 'react-beautiful-dnd';
import styled from 'styled-components';
import Column from './column';
import Task from './task';

const Container = styled.div`
  display: flex;
  background: lightblue;
`;

export default class Board extends Component<Props, State> {

  getTasks = (column) => {
    return this.props.tasks.filter(task => task.fields.column === column.pk).map(task => <Task task={task}/>);
  };

  render() {
    return (
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided, snapshot) => (
          <Container innerRef={provided.innerRef}>
            {this.props.columns.map((column, index) => (
              <Column
                key={column.pk}
                column={column}
                tasks={this.getTasks(column)}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    )
  }
}
