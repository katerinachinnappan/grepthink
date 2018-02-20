import React, { Component } from 'react';
import {Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, Props} from 'react-beautiful-dnd';
import styled from 'styled-components';
import { grid } from './constants';

const Wrapper = styled.div`
  display: flex;
`;

const Container = styled.div`
  width: 200px;
  margin: ${grid}px;
  background: lightpink;
`;

const Header = styled.h3`
  padding: ${grid}px;

  &:hover {
    background: purple;
  }
`;

const List = styled.div`
  background: lightgreen;
`;

class InnerList extends Component {
  shouldComponentUpdate(nextProps) {
    if(nextProps.tasks === this.props.tasks) {
      return false;
    }
    return true;
  }

  render() {
    return this.props.children;
  }
}

export default class Column extends  Component<Props> {
  render() {
    return (
      <Draggable draggableId={this.props.column.pk} index={this.props.index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Wrapper>
           <Container innerRef={provided.innerRef} {...provided.draggableProps}>


              <Header isDragging={snapshot.isDragging}>
                <Title
                  isDragging={snapshot.isDragging}
                  {...provided.dragHandleProps}
                >
                  {title}
                </Title>
              </Header>
              <List>
                 <InnerList>
                   {this.props.tasks}
                 </InnerList>
               </List>
            </Container>
            {provided.placeholder}
          </Wrapper>
        )}

      </Draggable>


      // <Draggable draggableId={this.props.column.pk} index={this.props.index}>
      //   {(provided, snapshot) => (
      //     <Wrapper>
      //       <Container innerRef={provided.innerRef} {...provided.draggableProps}>
      //         <Header {...provided.dragHandleProps}>
      //           {this.props.column.fields.title}
      //         </Header>
      //         <List>
      //           <InnerList>
      //             {this.props.tasks}
      //           </InnerList>
      //         </List>
      //       </Container>
      //       {provided.placeholder}
      //     </Wrapper>
      //   )}
      // </Draggable>
    );
  }
}
