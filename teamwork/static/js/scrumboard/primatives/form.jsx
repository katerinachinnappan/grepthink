import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import FormGroup from "react-bootstrap/es/FormGroup";
import ControlLabel from "react-bootstrap/es/ControlLabel";
import FormControl from "react-bootstrap/es/FormControl";
import HelpBlock from "react-bootstrap/es/HelpBlock";
import Checkbox from "react-bootstrap/es/Checkbox";
import Button from "react-bootstrap/es/Button";
import ButtonToolbar from "react-bootstrap/es/ButtonToolbar";
import Board from '../elements/board'

function FieldGroup({id, label, help, ...props}) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

export default class FormInstance extends Component {

  constructor(props) {
    super();
    this.state = {
      task: props.task //???
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }

  handleClose() {
    this.props.handleClose();
  }

  handleUpdate() {
    this.props.handleUpdate();
    this.handleClose();
  }

  handleDelete() {
    this.props.handleDelete();
    this.handleClose();
  }


  render() {

    return (
      <div>
        <form>
          <FieldGroup
            id="formControlsText"
            type="text"
            label="Title"
            placeholder={this.props.task.fields.title}
          />

          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Assigned To</ControlLabel>
            <FormControl componentClass="select" placeholder="select">
              <option value="select">select</option>
              <option value="other">...</option>
            </FormControl>
          </FormGroup>


          <Checkbox disabled={this.props.task.fields.assigned}>
            Assigned
          </Checkbox>

          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>Description</ControlLabel>
            <FormControl componentClass="textarea" placeholder="textarea"/>
          </FormGroup>

        </form>
        <ButtonToolbar>
          <Button onClick={() => this.handleDelete()} bsStyle="danger">Delete</Button>

          <Button onClick={() => this.handleUpdate()} bsStyle="success">Save </Button>
        </ButtonToolbar>
        <Button onClick={() => this.handleClose()}>Cancel</Button>

      </div>


    )
  }
}
