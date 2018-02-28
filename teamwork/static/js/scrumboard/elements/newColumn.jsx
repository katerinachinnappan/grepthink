import React from "react";
import {colors, grid} from "./constants";
import styled from 'styled-components';
import {withAlert} from 'react-alert'
// import InlineEdit from 'react-edit-inline';
import InlineEdit from '../../react-edit-inline';

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
    this.dataChanged = this.dataChanged.bind(this);
    this.state = {
      message: 'add new column',
      taskMap: props.taskMap
    };
    this.customValidateText = this.customValidateText.bind(this);
    this.handleAddColumn = this.handleAddColumn.bind(this);
  }

  dataChanged(data) {
    this.setState({
      message: 'add new column'
    });
    this.handleAddColumn(data.message)
  }

  customValidateText(text) {
    if (flag) {
      if (text in this.state.taskMap) {
        this.props.alert.error('Column name must be unique');
        return false;
      } else
        return (text.length > 0 && text.length < 64);
    }
    flag = !flag;
  }

   handleAddColumn(e) {
    this.props.onAddColumn(e);
  }


  render() {
    return (

      <Wrapper>
        <Container>
          <Header>
            <Title>
              <InlineEdit
                validate={this.customValidateText}
                activeClassName="editing"
                text={'add new column'}
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

