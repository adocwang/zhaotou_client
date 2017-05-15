import React from 'react'
import { Link } from 'react-router';
import NavLink from "../NavLink"
import {Navbar,Nav,NavItem,NavDropdown,MenuItem} from 'React-Bootstrap'
require('./Menu.css')

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            menuOpening:false,
            menuListHorizontaling:true,
        };
        this.handleToogleClick=this.handleToogleClick.bind(this);
        this.closeMenu=this.closeMenu.bind(this);
        var WINDOW_CHANGE_EVENT = ('onorientationchange' in window) ? 'orientationchange':'resize';
        window.addEventListener(WINDOW_CHANGE_EVENT, this.closeMenu);
    }

    handleToogleClick(){
        if(!this.state.menuOpening){
            this.setState({menuListHorizontaling:false});
        }else{
            var that=this;
            setTimeout(function(){that.setState({menuListHorizontaling: true})},500);
        }
        this.setState({menuOpening: !this.state.menuOpening});
    }

    closeMenu(){
        if(this.state.menuOpening){
            this.handleToogleClick();
        }
    }
    render () {
        return(
            <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/"><img src="./assets/image/logo_big_white.png"/></Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavLink to="/index" className="pure-menu-link">首页</NavLink>
                <NavLink to="/search" className="pure-menu-link">企业搜索</NavLink>
                <NavLink to="/share" className="pure-menu-link">资料分享</NavLink>
              </Nav>
              <Nav pullRight>
                  <NavLink to="/login" className="pure-menu-link">注册/登录</NavLink>
                  <NavLink to="/about" className="pure-menu-link">关于</NavLink>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        );
    }
}
