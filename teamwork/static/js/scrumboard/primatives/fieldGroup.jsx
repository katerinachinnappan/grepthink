import ControlLabel from "react-bootstrap/es/ControlLabel";
import FormControl from "react-bootstrap/es/FormControl";
import HelpBlock from "react-bootstrap/es/HelpBlock";
import React, {Component} from "react";


export default class FormGroup extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {id, label, help, ...props} = this.props;

    return (


      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
  }
}
