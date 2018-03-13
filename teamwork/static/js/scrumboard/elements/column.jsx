import React, {Component} from 'react';
import {Draggable} from 'react-beautiful-dnd';
import styled from 'styled-components';
import {borderRadius, colors, grid} from './constants';
import Title from '../primatives/title'
import {DraggableProvided, DraggableStateSnapshot} from "react-beautiful-dnd/lib/index";
import TaskList from "../primatives/list";
import type {Task} from "../primatives/types";
import InlineEdit from "../primatives/inline-edit";
import {withAlert} from "react-alert";
import DropdownButton from "react-bootstrap/es/DropdownButton";
import MenuItem from "react-bootstrap/es/MenuItem";
import '../styles.scss'
import {exportBoard} from "../functions/functions";
import {CSVLink} from "react-csv";

const linkStyle = {
  display: 'block',
  clear: 'both',
  lineHeight: 1.42857143,
  fontWeight: 400,
  paddingTop: 3,
  paddingRight: 20,
  paddingBottom: 3,
  paddingLeft: 20,
  whiteSpace: 'nowrap',
  color: '#777',
  hover: {
    background: "#494f57"
  }
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddButton = styled.button`
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


let flag = true;


class Column extends Component {

  constructor(props) {
    super(props);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
    this.customValidateText = this.customValidateText.bind(this);
    this.deleteColumn = this.deleteColumn.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
  }


  handleAddTask(e) {
    this.props.onAddTask(e);
  }

  handleDeleteTask(taskID) {
    this.props.handleDeleteTask(this.props.title, taskID)
  }

  handleUpdateTask(taskID, taskUpdate) {
    this.props.handleUpdateTask(this.props.title, taskID, taskUpdate)
  }

  dataChanged(data) {
    this.props.onTitleUpdate(this.props.title, data.message)
  }

  deleteColumn() {
    this.props.onDeleteColumn(this.props.title)
  }

  customValidateText(text) {
    if (text === this.props.title)
      return false;
    if (this.props.keys.includes(text)) {
      if (flag) {
        flag = false;
        this.props.alert.error('Column name must be unique');
      } else {
        flag = true;
      }
      return false;
    } else {
      return (text.length > 0 && text.length < 64 && text !== 'add new column...');
    }
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
                  <InlineEdit
                    validate={this.customValidateText}
                    activeClassName="editing"
                    text={title}
                    paramName="message"
                    change={this.dataChanged}
                  />
                </Title>

                <DropdownButton
                  bsStyle={'default'}
                  title={''}
                  id={title}
                >
                  <MenuItem eventKey="4" onClick={() => this.deleteColumn()}>Delete Column</MenuItem>
                </DropdownButton>

              </Header>
              <TaskList
                listId={title}
                listType="QUOTE"
                tasks={tasks}
                autoFocusQuoteId={this.props.autoFocusTaskId}
                handleDeleteTask={this.handleDeleteTask}
                handleUpdateTask={this.handleUpdateTask}
              />
              <AddButton type="submit" onClick={() => {
                this.handleAddTask(title)
              }}>
                add task
              </AddButton>


            </Container>
            {provided.placeholder}
          </Wrapper>

        )}
      </Draggable>


    );
  }
}


export default withAlert(Column)
