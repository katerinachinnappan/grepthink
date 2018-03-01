import React from "react";
import {colors, grid} from "./constants";
import styled from 'styled-components';
import {withAlert} from 'react-alert'
// import InlineEdit from 'react-edit-inline';
import InlineEdit from '../react-inline-edit';

const Title = styled.h4`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  &:focus {
    outline: 2px solid ${colors.purple};
    outline-offset: 2px;
  }
`;


const Wrapper = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.blue.light};
  transition: background-color 0.1s ease;
  &:hover {
    background-color: ${colors.blue.lighter};
  }
`;


let flag = true;

class NewColumn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {text: this.props.text};
    console.log(this.state.text);
    this.dataChanged = this.dataChanged.bind(this);
    this.customValidateText = this.customValidateText.bind(this);

  }


  dataChanged(data) {

    this.props.onAddColumn(data.message)

  }

  customValidateText(text) {
    if (text in this.props.taskMap) {
      if (flag) {
        flag = false;
        this.props.alert.error('Column name must be unique');
      } else {
        flag = true;
      }
      return false;
    } else {
      return (text.length > 0 && text.length < 64 && text != 'add new column');
    }
  }

  render() {
    return (

      <Wrapper fontSize={'1.5em'}>
        <Container>
          <Header>
            <Title>
              <InlineEdit
                validate={this.customValidateText}
                activeClassName="editing"
                text={this.state.text}
                paramName="message"
                change={this.dataChanged}
              />
            </Title>
          </Header>
        </Container>
      </Wrapper>

    );
  }

}

export default withAlert(NewColumn)

