import React, {Component} from 'react';
import styled, {injectGlobal} from 'styled-components';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from './column';
import {colors} from "./constants";
import reorder, {
  addColumnToTaskMap, addTaskToTaskMap, deleteColumn, deleteTask, exportBoard, reorderTaskMap,
  updateColumnName, updateTask
} from "../functions/functions";
import {DroppableProvided} from "react-beautiful-dnd/lib/index";
import type {TaskMap} from "../primatives/types";
import type {DraggableLocation, DragStart, DropResult} from "react-beautiful-dnd/lib/types";
import NewColumn from "./newColumn";
import {withAlert} from 'react-alert'
import {boardID, csrfmiddlewaretoken, JSONMembers, userMap} from "../data";
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {CSVLink} from "react-csv";
import ReactModal from "react-modal/dist/react-modal";

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

const ParentContainer = styled.div`
  height: ${({height}) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

class Board extends Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: this.props.initial,
      ordered: Object.keys(this.props.initial),
      autoFocusQuoteId: null,
      modalIsOpen: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleAddColumn = this.handleAddColumn.bind(this);
    this.handleUpdateColumnName = this.handleUpdateColumnName.bind(this);
    this.handleDeleteColumn = this.handleDeleteColumn.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  afterOpenModal() {
    this.subtitle.style.color = '#494f57';
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }


  componentDidMount() {
    injectGlobal`
      body {
        background: ${colors.blue.deep};
      }
    `;
  }

  onDragStart = (initial: DragStart) => {
    this.setState({
      autoFocusQuoteId: null,
    });
  };

  onDragEnd = (result: DropResult) => {
    // dropped nowhere
    if (!result.destination) {
      return;
    }
    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    // reordering column
    if (result.type === 'COLUMN') {
      const ordered: string[] = reorder(
        this.state.ordered,
        source.index,
        destination.index
      );

      const post_data = {
        'csrfmiddlewaretoken': csrfmiddlewaretoken,
        'columns': ordered,
        'board_id': boardID
      };

      this.setState({
          ordered,
        }, () => $.ajax({
          url: '/scrumboard/updateColumnIndex/',
          data: post_data,
          dataType: 'json',
          type: "POST",
          success: function (res) {
          },
          error: function (res) {
          }
        })
      );
    } else {
      const data = reorderTaskMap({
        taskMap: this.state.columns,
        source: source,
        destination,
      });
      this.setState({
        columns: data.taskMap,
        autoFocusQuoteId: data.autoFocusTaskId,
      });


    }
  };


  handleAddTask(index) {
    const data = addTaskToTaskMap(this.state.columns, index);
    this.setState({
      columns: data.taskMap,
      autoFocusQuoteId: data.autoFocusTaskId,
    });
  }

  handleAddColumn(columnName) {
    const data = addColumnToTaskMap(this.state.columns, columnName, this.state.ordered);
    const ordered = this.state.ordered;
    ordered.splice(ordered.length, 0, columnName);
    this.setState({
      ordered: ordered,
      columns: data.taskMap,
    });

  }

  handleUpdateColumnName(oldName, newName) {
    const data = updateColumnName(oldName, newName, this.state.columns, this.state.ordered);
    this.setState({
      columns: data.taskMap,
      ordered: data.keys,
    });
  }

  handleDeleteColumn(colName) {
    const data = deleteColumn(colName, this.state.columns, this.state.ordered);
    this.setState({
      columns: data.taskMap,
      ordered: data.keys,
    });
  }

  handleDeleteTask(colName, taskID) {
    const data = deleteTask(colName, taskID, this.state.columns);
    this.setState({
      columns: data.taskMap,
      autoFocusQuoteId: data.autoFocusTaskId,
    });
  }


  handleUpdateTask(colName, taskID, taskUpdate) {
    const data = updateTask(colName, taskID, this.state.columns, taskUpdate);
    this.setState({
      columns: data.taskMap,
      autoFocusQuoteId: data.autoFocusTaskId,
    });
  }


  render() {
    const columns: TaskMap = this.state.columns;
    const ordered: Column[] = this.state.ordered;
    const {containerHeight} = this.props;
    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
      >


        {(provided: DroppableProvided) => (
          <Container innerRef={provided.innerRef}>
            {ordered.map((key: string, index: number) =>
              (
                <Column
                  key={key}
                  index={index}
                  title={key}
                  tasks={columns[key]}
                  keys={ordered}
                  autoFocusTaskId={this.state.autoFocusQuoteId}
                  withAlert={this.props.alert}
                  onAddTask={this.handleAddTask}
                  onTitleUpdate={this.handleUpdateColumnName}
                  onDeleteColumn={this.handleDeleteColumn}
                  handleDeleteTask={this.handleDeleteTask}
                  handleUpdateTask={this.handleUpdateTask}
                />
              ))}
            <NewColumn
              text={"add new column..."}
              keys={ordered}
              withAlert={this.props.alert}
              onAddColumn={this.handleAddColumn}
            />
          </Container>
        )}
      </Droppable>
    );

    return (
      <div>
        <Navbar>
          <Nav>
            <NavItem eventKey={1} href="/myscrum/all">
              Home
            </NavItem>
            <NavDropdown eventKey={3} title="Options" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1} onClick={() => this.openModal()}
              > See Members</MenuItem>

              <CSVLink  filename="filename.csv" data={exportBoard(Object.values(this.state.columns))} headers={this.state.ordered}
                       style={linkStyle}> Export
                Board</CSVLink>

              <MenuItem divider/>
              <MenuItem eventKey={3.4} onClick={() =>
                $.ajax({
                  url: '/scrumboard/deleteBoard/',
                  data: {
                    'csrfmiddlewaretoken': csrfmiddlewaretoken,
                    'board_id': JSON.parse(server_data.board_id)
                  },
                  dataType: 'json',
                  type: "POST",
                  success: function (res) {
                    window.location.replace("/myscrum/all");
                  },
                  error: function (res) {
                  }
                })}

              >Delete Board</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar>


        <ReactModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="Modal"
          ariaHideApp={false}
        >
          <ul>
            {userMap.map(function (key, value) {
              return <li key={value}>{key.label}</li>
            })}
          </ul>
        </ReactModal>


        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >

          {this.props.containerHeight ? (
            <ParentContainer height={containerHeight}>{board}</ParentContainer>
          ) : (
            board
          )}
        </DragDropContext>
      </div>

    )
      ;
  }
}

export default withAlert(Board)
