

// {board: "[{"model": "scrumboard.board", "pk": 1, "fields": …ion": "first board", "owner": 1, "members": []}}]",
// columns: "[{"model": "scrumboard.column", "pk": 1, "fields":…d col", "description": "third col", "board": 1}}]",
// tasks: Array(1)}

import React from 'react';
import { render } from 'react-dom';
// a little css reset to make things look a bit nicer!
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import * as data from './data';
import Board from './board';

class App extends React.Component {
  state = {
    columns: data.columns,
    tasks: data.tasks,
  };

  onDragEnd = (result) => {

  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Board {...this.state} />
      </DragDropContext>
    )
  }
}

render(<App />, document.getElementById('root'));
// //
// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
// import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
// import * as data from './data';
//
// // fake data generator
// const getItems = count =>
//   Array.from({length: count}, (v, k) => k).map(k => ({
//     id: `item-${k}`,
//     content: `item ${k}`,
//   }));
//
// // a little function to help us with reordering the result
// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);
//
//   return result;
// };
//
// const grid = 8;
//
// const getItemStyle = (isDragging, draggableStyle) => ({
//   // some basic styles to make the items look a bit nicer
//   userSelect: 'none',
//   padding: grid * 2,
//   margin: `0 0 ${grid}px 0`,
//
//   // change background colour if dragging
//   background: isDragging ? 'lightgreen' : 'grey',
//
//   // styles we need to apply on draggables
//   ...draggableStyle,
// });
//
// const getListStyle = isDraggingOver => ({
//   background: isDraggingOver ? 'lightblue' : 'lightgrey',
//   padding: grid,
//   width: 250,
// });
//
// class App extends Component {
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       items: getItems(10),
//     };
//     this.onDragEnd = this.onDragEnd.bind(this);
//   }
//
//   onDragEnd(result) {
//
//     $.ajax({
//       url: '/scrumboard/update/',
//       data: {
//         'some data': 'some data'
//       },
//       dataType: 'json',
//       success: function (data) {
//         if (data.some_data) {
//           alert("A user with this username already exists.");
//         }
//       }
//     });
//
//     console.log(server_data);
//     console.log(data.board);
//     console.log(data.columns);
//     console.log(data.tasks);
//
//
//
//
//     // dropped outside the list
//     if (!result.destination) {
//       return;
//     }
//
//     const items = reorder(
//       this.state.items,
//       result.source.index,
//       result.destination.index
//     );
//
//     this.setState({
//       items,
//     });
//   }
//
//   // Normally you would want to split things out into separate components.
//   // But in this example everything is just done in one place for simplicity
//   render() {
//     return (
//       <DragDropContext onDragEnd={this.onDragEnd}>
//         <Droppable droppableId="droppable">
//           {(provided, snapshot) => (
//             <div
//               ref={provided.innerRef}
//               style={getListStyle(snapshot.isDraggingOver)}
//             >
//               {this.state.items.map((item, index) => (
//                 <Draggable key={item.id} draggableId={item.id} index={index}>
//                   {(provided, snapshot) => (
//                     <div>
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         style={getItemStyle(
//                           snapshot.isDragging,
//                           provided.draggableProps.style
//                         )}
//                       >
//                         {item.content}
//                       </div>
//                       {provided.placeholder}
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//
//     );
//   }
// }
//
// // Put the thing into the DOM!
// ReactDOM.render(<App/>, document.getElementById('root'));