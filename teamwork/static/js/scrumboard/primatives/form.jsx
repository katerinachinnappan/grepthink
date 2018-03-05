import React, {Component} from 'react';
import FormGroup from "react-bootstrap/es/FormGroup";
import ControlLabel from "react-bootstrap/es/ControlLabel";
import FormControl from "react-bootstrap/es/FormControl";
import Checkbox from "react-bootstrap/es/Checkbox";
import Button from "react-bootstrap/es/Button";
import ButtonToolbar from "react-bootstrap/es/ButtonToolbar";
import {CirclePicker} from "react-color";


export default class FormInstance extends Component {

  constructor(props) {
    super();
    this.state = {
      task: props.task,
      background: null,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
  }

  handleClose() {
    this.props.handleClose();
  }

  handleUpdate(title, desc, members, assigned) {
    if (this.state.background === null)
      this.props.handleUpdate(title, desc, members, assigned, this.props.task.fields.colour);
    else
      this.props.handleUpdate(title, desc, members, assigned, this.state.background);
    this.handleClose();
  }

  handleDeleteTask() {
    this.props.handleDeleteTask();
    this.handleClose();
  }

  handleChangeComplete = (color, event) => {
    this.setState({background: color.hex});
  };


  render() {
    return (
      <div>
        <form onSubmit={event => event.preventDefault()}>

          <FormGroup controlId={"formControlsText"}>
            <ControlLabel>{"Title"}</ControlLabel>
            <FormControl
              inputRef={ref => this.title = ref}
              ref='title'
              id="formControlsText"
              type="text"
              label="Title"
              placeholder={this.props.task.fields.title}
            />
          </FormGroup>

          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Assigned To</ControlLabel>
            <FormControl inputRef={node => this.members = node} componentClass="select" placeholder="select">
              <option value="select">select</option>
              <option value="other">...</option>
            </FormControl>
          </FormGroup>

          <Checkbox inputRef={node => this.assigned = node} disabled={this.props.task.fields.assigned}>
            Assigned
          </Checkbox>

          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>Description</ControlLabel>
            <FormControl inputRef={node => this.description = node} componentClass="textarea" placeholder="textarea"/>
          </FormGroup>

          <ControlLabel>Colour</ControlLabel>
          <CirclePicker onChangeComplete={this.handleChangeComplete}/>
          <p/><p/><p/>

        </form>

        <ButtonToolbar>
          <Button onClick={() => this.handleDeleteTask()} bsStyle="danger">Delete</Button>

          <Button onClick={() => this.handleUpdate(
            this.title.value,
            this.members.value,
            this.assigned.value,
            this.description.value,
          )} bsStyle="success">Save </Button>
        </ButtonToolbar>
        <Button onClick={() => this.handleClose()}>Cancel</Button>


      </div>


    )
  }
}