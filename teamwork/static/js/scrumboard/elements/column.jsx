import React, {Component} from 'react';
import {Draggable} from 'react-beautiful-dnd';
import styled from 'styled-components';
import {borderRadius, colors, grid} from './constants';
import Title from '../primatives/title'
import {DraggableProvided, DraggableStateSnapshot} from "react-beautiful-dnd/lib/index";
import QuoteList from "../primatives/list";
import type {Task, TaskMap} from "../primatives/types";


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  color: ${colors.black};
  border: none;
  background-color: ${colors.lightBlue};
  font-size: 1.2em;
  &:focus { outline:0 !important; }
  &:hover {
    background-color: ${colors.blue.lighter};
  }
`;


const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({isDragging}) => (isDragging ? colors.blue.lighter : colors.blue.light)};
  transition: background-color 0.1s ease;
  &:hover {
    background-color: ${colors.blue.lighter};
  }
`;


type Props = {|
  title: string,
  tasks: Task[],
  index: number,
  autoFocusTaskId: ?string,
|}


export default class Column extends Component {

  constructor(props) {
    super(props);
    this.handleAddTask = this.handleAddTask.bind(this);
  }

  handleAddTask(e) {
    this.props.onAddTask(e);
  }

  render() {
    const title: string = this.props.title;
    const tasks: Task[] = this.props.tasks;
    const index: number = this.props.index;
    return (

      <Draggable draggableId={title} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Wrapper>
            <Container
              innerRef={provided.innerRef}
              {...provided.draggableProps}
            >
              <Header isDragging={snapshot.isDragging}>
                <Title
                  isDragging={snapshot.isDragging}
                  {...provided.dragHandleProps}
                >
                  {title}
                </Title>
              </Header>
              <QuoteList
                listId={title}
                listType="QUOTE"
                tasks={tasks}
                autoFocusQuoteId={this.props.autoFocusTaskId}
              />
              <Button type="submit" onClick={() => {

                this.handleAddTask(title)

              }}>add task
              </Button>

            </Container>
            {provided.placeholder}
          </Wrapper>

        )}
      </Draggable>
    );
  }
}


