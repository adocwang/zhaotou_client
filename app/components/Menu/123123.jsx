import React from 'react'
require('./Menu.css')

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
    }
    render () {
        return(
            <div class="custom-wrapper pure-g" id="menu">
                <div class="pure-u-1 pure-u-md-1-3">
                    <div class="pure-menu">
                        <a href="#" class="pure-menu-heading custom-brand">无忧招投</a>
                        <a href="#" class="custom-toggle" id="toggle"><s class="bar"></s><s class="bar"></s></a>
                    </div>
                </div>
                <div class="pure-u-1 pure-u-md-1-3">
                    <div class="pure-menu pure-menu-horizontal custom-can-transform">
                        <ul class="pure-menu-list">
                            <li class="pure-menu-item"><a href="#" class="pure-menu-link">首页</a></li>
                            <li class="pure-menu-item"><a href="#" class="pure-menu-link">资料分享</a></li>
                            <li class="pure-menu-item"><a href="#" class="pure-menu-link">联系人</a></li>
                        </ul>
                    </div>
                </div>
                <div class="pure-u-1 pure-u-md-1-3">
                    <div class="pure-menu pure-menu-horizontal custom-menu-3 custom-can-transform">
                        <ul class="pure-menu-list">
                            <li class="pure-menu-item"><a href="#" class="pure-menu-link">我的</a></li>
                            <li class="pure-menu-item"><a href="#" class="pure-menu-link">关于</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
