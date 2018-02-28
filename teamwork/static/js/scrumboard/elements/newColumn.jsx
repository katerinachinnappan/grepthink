import React from "react";
import {colors, grid} from "./constants";
import styled from 'styled-components';
import { withAlert } from 'react-alert'
// import InlineEdit from 'react-edit-inline';

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

class NewColumn extends React.Component {
  constructor(props) {
    super(props);
    this.dataChanged = this.dataChanged.bind(this);
    this.state = {
      message: 'add new column',
      taskMap: props.taskMap
    };
    this.customValidateText = this.customValidateText.bind(this);

  }

  dataChanged(data) {
    this.setState({...data})
  }

  customValidateText(text) {
    console.log(this.props.alert);
    if(text in this.state.taskMap) {
      withAlert.show('Oh look, an alert!');
      return false;
    }else
      return (text.length > 0 && text.length < 64);
  }


  render() {
    return (

      <Wrapper>
        <Container>
          <Header>
            <Title>
              {/*<InlineEdit*/}
                {/*validate={this.customValidateText}*/}
                {/*activeClassName="editing"*/}
                {/*text={this.state.message}*/}
                {/*paramName="message"*/}
                {/*change={this.dataChanged}*/}
              {/*/>*/}
            </Title>
          </Header>
        </Container>
      </Wrapper>

    );
  }

}

export default withAlert(NewColumn)

