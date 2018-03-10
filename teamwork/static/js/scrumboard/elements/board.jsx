import React, {Component} from 'react';
import styled, {injectGlobal} from 'styled-components';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from './column';
import {colors} from "./constants";
import reorder, {
  addColumnToTaskMap, addNewColumn, addTaskToTaskMap, deleteColumn, deleteTask, exportBoard, reorderTaskMap,
  updateColumnName
} from "../functions/functions";
import {DroppableProvided} from "react-beautiful-dnd/lib/index";
import type {TaskMap} from "../primatives/types";
import type {DraggableLocation, DragStart, DropResult} from "react-beautiful-dnd/lib/types";
import NewColumn from "./newColumn";
import {withAlert} from 'react-alert'
import {boardID, csrfmiddlewaretoken, itemMap} from "../data";
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {CSVDownload, CSVLink} from "react-csv";

const linkStyle = {
    display: 'block',
    clear: 'both',
    lineHeight: 1.42857143,
    fontWeight: 400,
    paddingTop: 3,
    paddingRight: 20,
    paddingBottom: 3,
    paddingLeft: 20,
    whiteSpace: 'nowrap'};

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
    };
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleAddColumn = this.handleAddColumn.bind(this);
    this.handleUpdateColumnName = this.handleUpdateColumnName.bind(this);
    this.handleDeleteColumn = this.handleDeleteColumn.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
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
      const post_data = {
        'csrfmiddlewaretoken': csrfmiddlewaretoken,
        'sorted': this.state.columns,
        'board_id': JSON.parse(server_data.board_id)
      };

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
            <NavItem eventKey={1} href="#">
              Home
            </NavItem>
            <NavItem eventKey={2} href="#">
              New Board
            </NavItem>
            <NavDropdown eventKey={3} title="Options" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1} >See Members</MenuItem>

              <CSVLink data={exportBoard(Object.values(this.state.columns))} headers={ this.state.ordered} style={linkStyle}> Export
                Board</CSVLink>

              <MenuItem divider/>
              <MenuItem eventKey={3.4}>Delete Board</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar>

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

    );
  }
}

export default withAlert(Board)
