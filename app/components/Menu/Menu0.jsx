import React from 'react'
import NavLink from "../NavLink"
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
            <div className={(this.state.menuOpening?"open ":"")+"custom-wrapper pure-g"}>
                <div className="pure-u-1 pure-u-md-1-3 title-item">
                    <div className="pure-menu">
                        <NavLink to="/" activeClassName="active" className="pure-menu-heading custom-brand"><img src="./assets/image/logo_big_white.png"/></NavLink>
                        <a href="javascript:;" className="custom-toggle" onClick={this.handleToogleClick}><s className="bar"></s><s className="bar"></s></a>
                    </div>
                </div>
                <div className="pure-u-1 pure-u-md-1-3 title-item">
                    <div className={(this.state.menuListHorizontaling?"pure-menu-horizontal ":"")+"pure-menu custom-can-transform"}>
                        <ul className="pure-menu-list">
                            <li className="pure-menu-item"><NavLink to="/index" activeClassName="title-active" className="pure-menu-link">首页</NavLink></li>
                            <li className="pure-menu-item"><NavLink to="/search" className="pure-menu-link">企业搜索</NavLink></li>
                            <li className="pure-menu-item"><a href="#" className="pure-menu-link">资料分享</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pure-u-1 pure-u-md-1-3 title-item">
                    <div className={(this.state.menuListHorizontaling?"pure-menu-horizontal ":"")+"pure-menu custom-menu-3 custom-can-transform"}>
                        <ul className="pure-menu-list">
                            <li className="pure-menu-item"><a href="#" className="pure-menu-link">会员中心</a></li>
                            <li className="pure-menu-item"><a href="#" className="pure-menu-link">关于</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
