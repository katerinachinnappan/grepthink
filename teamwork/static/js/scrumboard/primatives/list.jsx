import React, {Component} from 'react';
import styled from 'styled-components';
import TaskItem from './item';
import {grid, colors} from '../elements/constants';
import Title from '../primatives/title';
import type {Task} from "./types";

import {
  Draggable, Droppable
} from "react-beautiful-dnd";


import {
  DraggableProvided, DraggableStateSnapshot, DroppableProvided,
  DroppableStateSnapshot
} from "react-beautiful-dnd/lib/index";

const Wrapper = styled.div`
  background-color: ${({isDraggingOver}) => (isDraggingOver ? colors.blue.lighter : colors.blue.light)};
  display: flex;
  flex-direction: column;
  opacity: ${({isDropDisabled}) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.1s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
`;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: 250px;
  /* not relying on the items for a margin-bottom
  as it will collapse when the list is empty */
  margin-bottom: ${grid}px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 300px;
`;

const Container = styled.div``;

type Props = {|
  listId: string,
  listType?: string,
  tasks: Task[],
  title?: string,
  internalScroll?: boolean,
  isDropDisabled ?: boolean,
  style?: Object,

  // may not be provided - and might be null
  autoFocusQuoteId?: ?string,
  ignoreContainerClipping?: boolean,
|}

type TaskListProps = {|
  tasks: Task[],
  autoFocusTaskId: ?string,
|}

class InnerTaskList extends Component<> {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    };

  }

  shouldComponentUpdate(nextProps: TaskListProps) {
    return nextProps.tasks !== this.props.tasks;
  }


  render() {
    // const tasks = this.props.tasks || [ ]


    return (
      <div>
        {this.props.tasks.map((task: Task, index: number) => (
          <Draggable key={task.pk} draggableId={task.pk} index={index}>
            {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
              <div>
                <TaskItem
                  key={task.pk}
                  task={task}
                  isDragging={dragSnapshot.isDragging}
                  provided={dragProvided}
                  autoFocus={this.props.autoFocusTaskId === task.pk}
                />
                {dragProvided.placeholder}
              </div>
            )}
          </Draggable>
        ))}
      </div>
    );
  }
}

type InnerListProps = {|
  dropProvided: DroppableProvided,
  quotes: Task[],
  title: ?string,
  autoFocusQuoteId: ?string,
|}

class InnerList extends Component<InnerListProps> {
  render() {
    const {tasks, dropProvided, autoFocusQuoteId} = this.props;
    const title = this.props.title ? (
      <Title>{this.props.title}</Title>
    ) : null;

    return (
      <Container>
        {title}
        <DropZone innerRef={dropProvided.innerRef}>
          <InnerTaskList
            tasks={tasks}
            autoFocusQuoteId={autoFocusQuoteId}
          />
          {dropProvided.placeholder}
        </DropZone>
      </Container>
    );
  }
}

export default class TaskList extends Component<Props> {
  render() {
    const {
      ignoreContainerClipping,
      internalScroll,
      isDropDisabled,
      listId,
      listType,
      style,
      tasks,
      autoFocusQuoteId,
      title,
    } = this.props;

    return (
      <Droppable
        droppableId={listId}
        type={listType}
        ignoreContainerClipping={ignoreContainerClipping}
        isDropDisabled={isDropDisabled}
      >
        {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
          <Wrapper
            style={style}
            isDraggingOver={dropSnapshot.isDraggingOver}
            isDropDisabled={isDropDisabled}
          >
            {internalScroll ? (
              <ScrollContainer>
                <InnerList
                  tasks={tasks}
                  title={title}
                  dropProvided={dropProvided}
                  autoFocusQuoteId={autoFocusQuoteId}
                />
              </ScrollContainer>
            ) : (
              <InnerList
                tasks={tasks}
                title={title}
                dropProvided={dropProvided}
                autoFocusQuoteId={autoFocusQuoteId}
              />
            )
            }
          </Wrapper>
        )}
      </Droppable>
    );
  }
}
