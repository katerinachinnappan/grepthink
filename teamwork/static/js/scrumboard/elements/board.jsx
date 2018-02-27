import React, {Component} from 'react';
import styled, {injectGlobal} from 'styled-components';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from './column';
import {colors} from "./constants";
import reorder, {addToTaskMap, reorderTaskMap} from "../functions/reorder";
import {DroppableProvided} from "react-beautiful-dnd/lib/index";
import type {TaskMap} from "../primatives/types";
import type {DraggableLocation, DragStart, DropResult} from "react-beautiful-dnd/lib/types";


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

let count = 10;

export default class Board extends Component {

  constructor(props) {
    super(props);

    this.state = {
      columns: this.props.initial,
      ordered: Object.keys(this.props.initial),
      autoFocusQuoteId: null,
      somestate: false,
    };

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
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


  handleFilterTextChange(index) {
   const data = addToTaskMap(this.state.columns, index);

    this.setState({
      columns: data.taskMap,
      autoFocusQuoteId: data.autoFocusTaskId,
    });

    // this.setState((prevState, props) => {
    //   // console.log(prevState.columns[index]);
    //
    //   return {columns: prevState.columns[index].push({
    //     model: "scrumboard.task",
    //     pk: 10,
    //     fields: {
    //       assigned: true,
    //       board: 1,
    //       column: 1,
    //       description: 'add',
    //       title: 'add',
    //       userID: 1,
    //     },
    //   }
    //
    // )};
    // });
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
                  autoFocusTaskId={this.state.autoFocusQuoteId}
                  onFilterTextChange={this.handleFilterTextChange}
                />
              ))}
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

