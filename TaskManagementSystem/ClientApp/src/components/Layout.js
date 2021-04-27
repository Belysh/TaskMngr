import React, { Component } from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import Header from './Header/Header';
import Menu from './Menu/Menu';

export class Layout extends Component {
  static displayName = Layout.name;
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpened: false
    }
  }

  openMenu() {
    return ()=>{
      this.setState({menuIsOpened: true})
    }
  }

  closeMenu() {
    return ()=>{
      this.setState({menuIsOpened: false})
    }
  }

  render () {
    return (
      <div className='wrapper'>
        <Menu closeMenu={this.closeMenu()} menuIsOpened={this.state.menuIsOpened} />
        <div className='main-container'>
          <Header openMenu={this.openMenu()} />
          <div className='content'>
              {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
