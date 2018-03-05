import React, {Component} from 'react';
import styled, {injectGlobal} from 'styled-components';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from './column';
import {colors} from "./constants";
import reorder, {
  addColumnToTaskMap, addNewColumn, addTaskToTaskMap, deleteColumn, deleteTask, reorderTaskMap,
  updateColumnName
} from "../functions/functions";
import {DroppableProvided} from "react-beautiful-dnd/lib/index";
import type {TaskMap} from "../primatives/types";
import type {DraggableLocation, DragStart, DropResult} from "react-beautiful-dnd/lib/types";
import NewColumn from "./newColumn";
import {withAlert} from 'react-alert'
import {CirclePicker} from "react-color";


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


// type Props = {|
//   initial: TaskMap,
//   containerHeight?: string,
// |}
//
// type State = {|
//   columns: TaskMap,
//   ordered: string[],
//   autoFocusQuoteId: ?string,
// |}

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

      this.setState({
        ordered,
      });

      return;
    }

    const data = reorderTaskMap({
      taskMap: this.state.columns,
      source: source,
      destination,
    });

    this.setState({
      columns: data.taskMap,
      autoFocusQuoteId: data.autoFocusTaskId,
    });
  };


  handleAddTask(index) {
    const data = addTaskToTaskMap(this.state.columns, index);
    this.setState({
      columns: data.taskMap,
      autoFocusQuoteId: data.autoFocusTaskId,
    });
  }

  handleAddColumn(columnName) {
    const data = addColumnToTaskMap(this.state.columns, columnName);
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
    );
  }
}

export default withAlert(Board)