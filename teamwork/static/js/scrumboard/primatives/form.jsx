import React, {Component} from 'react';
import FormGroup from "react-bootstrap/es/FormGroup";
import ControlLabel from "react-bootstrap/es/ControlLabel";
import FormControl from "react-bootstrap/es/FormControl";
import Checkbox from "react-bootstrap/es/Checkbox";
import Button from "react-bootstrap/es/Button";
import ButtonToolbar from "react-bootstrap/es/ButtonToolbar";
import {CirclePicker} from "react-color";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {userMap, getMemberByID} from "../data";


export default class FormInstance extends Component {

  constructor(props) {
    super();
    this.state = {
      task: props.task,
      background: null,
      value: props.task.fields.members, //TODO Change this to current members on the task
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleClose() {
    this.props.handleClose();
  }


  handleSelectChange(value) {
    this.setState({value});
  }

  handleUpdate(title, desc) {
    if (this.state.background === null)
      this.props.handleUpdate(title, desc, this.state.value, this.props.task.fields.colour);
    else
      this.props.handleUpdate(title, desc, this.state.value, this.state.background);
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
    const {value} = this.state;

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
              defaultValue={this.props.task.fields.title}
            />
          </FormGroup>

          <ControlLabel>Assigned To</ControlLabel>
          <Select
            name="form-field-name"
            multi
            onChange={this.handleSelectChange}
            value={value}
            options={
              userMap
            }
          />


          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>Description</ControlLabel>
            <FormControl inputRef={node => this.description = node} componentClass="textarea" defaultValue={this.props.task.fields.description}/>
          </FormGroup>

          <ControlLabel>Colour</ControlLabel>
          <CirclePicker onChangeComplete={this.handleChangeComplete}/>
          <p/><p/><p/>

        </form>

        <ButtonToolbar>
          <Button onClick={() => this.handleDeleteTask()} bsStyle="danger">Delete</Button>

          <Button onClick={() => this.handleUpdate(
            this.title.value,
            this.description.value,
          )} bsStyle="success">Save </Button>
        </ButtonToolbar>
        <Button onClick={() => this.handleClose()}>Cancel</Button>


      </div>


    )
  }
}
