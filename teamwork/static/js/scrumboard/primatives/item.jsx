import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {borderRadius, colors, grid} from '../elements/constants';
import type {Task} from "./types";
import {DraggableProvided} from "react-beautiful-dnd/lib/index";
import ReactModal from "react-modal/dist/react-modal";
import FormInstance from './form'

type Props = {
  task: Task,
  isDragging: boolean,
  provided: DraggableProvided,
  autoFocus?: boolean,
}

type HTMLElement = any;

const Container = styled.a`
border-radius: ${borderRadius}px;
border: 1px solid grey;
background-color: ${({isDragging, colour}) => (isDragging ? colors.green : colour)};

box-shadow: ${({isDragging}) => (isDragging ? `2px 2px 1px ${colors.shadow}` : 'none')};
padding: ${grid}px;
min-height: 40px;
margin-bottom: ${grid}px;
user-select: none;
transition: background-color 0.1s ease;


/* anchor overrides */
color: ${colors.black};

&:hover {
  color: ${colors.black};
  text-decoration: none;
}
&:focus {
  outline: 2px solid ${colors.purple};
  box-shadow: none;
}

/* flexbox */
display: flex;
align-items: center;
`;


const Content = styled.div`
/* flex child */
flex-grow: 1;

/* Needed to wrap text in ie11 */
/* https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox */
flex-basis: 100%

/* flex parent */
display: flex;
flex-direction: column;
`;

const BlockQuote = styled.div`
&::before {
  content: open-quote;
}

&::after {
  content: close-quote;
}
`;

const Footer = styled.div`
display: flex;
margin-top: ${grid}px;
`;

const TaskID = styled.small`
flex-grow: 0;
margin: 0;
`;

const Attribution = styled.small`
margin: 0;
margin-left: ${grid}px;
text-align: right;
flex-grow: 1;
`;


export default class TaskItem extends PureComponent<Props> {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    this.subtitle.style.color = '#494f57';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleUpdate(title, desc, members, assigned, colour) {
    this.props.handleUpdate(this.props.index, title, desc, members, assigned, colour);
  }

  handleDeleteTask() {
    this.props.handleDeleteTask(this.props.index);
  }


  componentDidMount() {
    if (!this.props.autoFocus) {
      return;
    }
    const node: HTMLElement = ReactDOM.findDOMNode(this);
    node.focus();
  }

  render() {
    const {task, isDragging, provided} = this.props;
    return (

      <Container
        colour={task.fields.colour}
        isDragging={isDragging}
        innerRef={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onDoubleClick={() => {
          this.openModal();
        }}
      >
        <ReactModal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          className="Modal"
          ariaHideApp={false}
        >
          <h2 ref={subtitle => this.subtitle = subtitle}>{task.fields.title}</h2>

          <FormInstance
            task={task}
            handleClose={this.closeModal}
            handleUpdate={this.handleUpdate}
            handleDeleteTask={this.handleDeleteTask}
          />


        </ReactModal>


        <Content>
          <BlockQuote>{task.fields.title}</BlockQuote>
          <Footer>
            <TaskID>(id: {task.pk})</TaskID>
            <Attribution>{task.fields.description}</Attribution>
          </Footer>
        </Content>
      </Container>

    );
  }
}

