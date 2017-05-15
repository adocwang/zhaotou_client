import React, { PropTypes } from 'react'
import * as Bs from "React-Bootstrap"
import Config from '../../config/Config'

var pageSize=10;
class CompanyDetail extends React.Component {
    constructor(props){
        super(props);
        this.state={
            companyData:{},
            personCertTypes:[],
            selectedPersonCertId:-1,
            selectedPersonCertName:"",
            tabKey:1,
            personPage:1,
        };
        console.log(props);
        this.componentDidMount=this.componentDidMount.bind(this);
        this.doPersonFilter=this.doPersonFilter.bind(this);
    }

    componentDidMount(){
        var that=this;
        fetch(Config.api_base_url+"/company_detail/"+this.props.params.compId)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            that.setState({companyData:json});
            console.log(json);
        }).catch(function(error) {
            console.log('parsing failed', error)
        })

        fetch('./assets/condition_options.json')
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            console.log(json);
            var types=json.person.subs.map((type,index)=>{
                return type.text;
            });
            that.setState({personCertTypes:types});
        }).catch(function(error) {
            console.log('parsing failed', error)
        })
    }

    selectConditionOption(event){
        var id=event.target.value;
        this.setState({selectedPersonCertId:id});
    }

    doPersonFilter(){
        var id=this.state.selectedPersonCertId;
        if(id==-1){
        this.setState({selectedPersonCertName:""});
        }else{
            var text=this.state.personCertTypes[id];
            this.setState({selectedPersonCertName:text,personPage:1});
        }
    }

    getPersons(){
        if(typeof this.state.companyData.person == "undefined"){
            return [];
        }
        var filterCondition=this.state.selectedPersonCertName;
        var tmpPersons=[];
        this.state.companyData.person.map(value=>{
            if(filterCondition==""){
                tmpPersons.push(value);
                return;
            }
            if(value.cert.length < 1){
                return;
            }
            var tmpPerson={
                name:value.name,
                cert:[]
            };
            value.cert.map(v=>{
                if(v.indexOf(filterCondition)!=-1){
                    tmpPerson.cert.push(v);
                }
            });
            if(tmpPerson.cert.length>0){
                tmpPersons.push(tmpPerson);
            }
        });
        console.log(tmpPersons);
        var page = this.state.personPage;
        var max=Math.min(page*pageSize,tmpPersons.length);
        var res=[];
        for(var i=(page-1)*pageSize;i < max;i++){
            res.push(tmpPersons[i]);
        }
        return {persons:res,pageCount:Math.ceil(tmpPersons.length/pageSize),personCount:tmpPersons.length};
    }

    handleTabSelect(key){
        this.setState({tabKey:key});
    }

    personPageSelect(page){
        this.setState({personPage:page});
    }

    render () {
        var companyData=this.state.companyData;
        var tabContent="暂无信息！";
        var personsData=this.getPersons();
        var pageCount=personsData.pageCount;
        var persons=personsData.persons;
        var personCount=personsData.personCount;
        switch (this.state.tabKey) {
            case 1:
                var startDate = new Date();
                startDate.setTime(companyData.startTime * 1000);
                tabContent=(
                    <div className="company-detail">
                        <Bs.Row className="company-detail-row">
                            <Bs.Col sm={2} xs={3}>公司名称：</Bs.Col>
                            <Bs.Col sm={10} xs={9}>{typeof companyData.compName!="undefined"?companyData.compName:"暂无信息"}</Bs.Col>
                        </Bs.Row>
                        <Bs.Row className="company-detail-row">
                            <Bs.Col sm={2} xs={3}>营业执照：</Bs.Col>
                            <Bs.Col sm={10} xs={9}>{typeof companyData.licienceNumber!="undefined"?companyData.licienceNumber:"暂无信息"}</Bs.Col>
                        </Bs.Row>
                        <Bs.Row className="company-detail-row">
                            <Bs.Col sm={2} xs={3}>注册地址：</Bs.Col>
                            <Bs.Col sm={10} xs={9}>{typeof companyData.address!="undefined"?companyData.address:"暂无信息"}</Bs.Col>
                        </Bs.Row>
                        <Bs.Row className="company-detail-row">
                            <Bs.Col sm={2} xs={3}>企业法人：</Bs.Col>
                            <Bs.Col sm={10} xs={9}>{typeof companyData.legalMan!="undefined"?companyData.legalMan:"暂无信息"}</Bs.Col>
                        </Bs.Row>
                        <Bs.Row className="company-detail-row">
                            <Bs.Col sm={2} xs={3}>注册资本：</Bs.Col>
                            <Bs.Col sm={10} xs={9}>{typeof companyData.capital!="undefined"?companyData.capital:"暂无信息"}</Bs.Col>
                        </Bs.Row>
                        <Bs.Row className="company-detail-row">
                            <Bs.Col sm={2} xs={3}>成立时间：</Bs.Col>
                            <Bs.Col sm={10} xs={9}>{typeof companyData.startTime!="undefined"?startDate.getFullYear()+"年"+startDate.getMonth()+"月"+startDate.getDate()+"日":"暂无信息"}</Bs.Col>
                        </Bs.Row>
                    </div>
                )
                break;
            case 2:
                var lines=[];
                    lines.push(
                            <Bs.Row className="company-detail-header" key={-1}>
                                <Bs.Col sm={3} xs={4}>资质类别</Bs.Col>
                                <Bs.Col sm={3} xs={4}>资质专业</Bs.Col>
                                <Bs.Col sm={3} xs={4}>资质等级</Bs.Col>
                            </Bs.Row>
                    )
                    for(var i=0;i < companyData.zizhi.length;i++){
                        var zizhi=companyData.zizhi[i];
                        var fields=zizhi.split(":");
                        lines.push(
                            <Bs.Row className="company-detail-row" key={i}>
                                <Bs.Col sm={3} xs={4}>{fields[0]}</Bs.Col>
                                <Bs.Col sm={3} xs={4}>{fields[1]}</Bs.Col>
                                <Bs.Col sm={3} xs={4}>{fields[2]}</Bs.Col>
                            </Bs.Row>
                        )
                    }
                    tabContent=(
                        <div className="company-detail">
                            {lines}
                        </div>
                    );
                    break;
                case 3:
                    var lines=[];
                        for(var i=0;i < persons.length;i++){
                            var person=persons[i];
                            var certCounts=person.cert.length;
                            for(var j=0;j < certCounts;j++){
                                var fields=person.cert[j].split(":");
                                if(j==0){
                                    lines.push(
                                        <tr key={i+""+j} className={"company-detail-tr "+"company-detail-tr-bg"+(i%2)}>
                                            <td rowSpan={certCounts} className="company-detail-td-cross">{person.name}</td>
                                            <td className="company-detail-td">{typeof fields[0]!="undefined"?fields[0]:""}</td>
                                            <td className="company-detail-td">{typeof fields[1]!="undefined"?fields[1]:""}</td>
                                            <td className="company-detail-td">{typeof fields[2]!="undefined"?fields[2]:""}</td>
                                        </tr>
                                    )
                                }else{
                                    lines.push(
                                        <tr key={i+""+j} className={"company-detail-tr "+"company-detail-tr-bg"+(i%2)}>
                                            <td className="company-detail-td">{typeof fields[0]!="undefined"?fields[0]:""}</td>
                                            <td className="company-detail-td">{typeof fields[1]!="undefined"?fields[1]:""}</td>
                                            <td className="company-detail-td">{typeof fields[2]!="undefined"?fields[2]:""}</td>
                                        </tr>
                                    )
                                }
                            }
                        }
                        tabContent=(
                            <div className="company-detail">
                                <div className="company-detail-filter">
                                    <Bs.Form inline>
                                        <Bs.FormControl componentClass="select" placeholder="显示全部证书" onChange={this.selectConditionOption.bind(this)} value={this.state.selectedPersonCertId}>
                                            <option value={-1} key={-1}>显示全部</option>
                                            {this.state.personCertTypes.map(function(text,i){
                                                return(<option value={i} key={i}>{text}</option>)
                                            })}
                                        </Bs.FormControl>
                                        <Bs.Button onClick={this.doPersonFilter} className="condition-add-btn" bsStyle="primary">
                                            过滤
                                        </Bs.Button>
                                    </Bs.Form>
                                </div>
                                <Bs.Table responsive>
                                    <thead>
                                        <tr>
                                            <th>姓名</th>
                                            <th>证书</th>
                                            <th>专业</th>
                                            <th>级别</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lines}
                                    </tbody>
                                </Bs.Table>
                                <Bs.Row>
                                    <Bs.Col xs={12}>
                                        <Bs.Pagination
                                            prev
                                            next
                                            ellipsis
                                            boundaryLinks
                                            items={pageCount}
                                            maxButtons={5}
                                            activePage={this.state.personPage}
                                            onSelect={this.personPageSelect.bind(this)} />
                                        <div className="pager-comment">共{pageCount}页 , {personCount}人</div>
                                    </Bs.Col>
                                </Bs.Row>
                            </div>
                        );
                        break;
            default:

        }
        return (
            <Bs.Grid>
                <Bs.Row>
                    <Bs.Col>
                        <Bs.Breadcrumb>
                            <Bs.Breadcrumb.Item href="/#/">
                                首页
                            </Bs.Breadcrumb.Item>
                            <Bs.Breadcrumb.Item href="">
                                {companyData.compName}
                            </Bs.Breadcrumb.Item>
                        </Bs.Breadcrumb>
                    </Bs.Col>
                </Bs.Row>
                <Bs.Row>
                    <Bs.Col>
                        <div className="company-card">
                            <h3>{companyData.compName}</h3>
                            <p><Bs.Glyphicon glyph="user" /> 联系人员：{typeof companyData.legalMan!="undefined"?companyData.legalMan:"暂无信息"}</p>
                            <p><Bs.Glyphicon glyph="phone-alt" /> 联系短话：{typeof companyData.contactPhone!="undefined"?companyData.contactPhone:"暂无信息"}</p>
                            <p><Bs.Glyphicon glyph="file" /> 资质数量：{typeof companyData.zizhi!="undefined"?companyData.zizhi.length:""}</p>
                            <p><Bs.Glyphicon glyph="education" /> 备案人数：{typeof companyData.person!="undefined"?companyData.person.length:""}</p>
                            <p><Bs.Glyphicon glyph="map-marker" /> 企业地址：{typeof companyData.address!="undefined"?companyData.address:""}</p>
                        </div>
                    </Bs.Col>
                </Bs.Row>
                <Bs.Row>
                    <Bs.Col>
                        <Bs.Nav bsStyle="tabs" justified activeKey={this.state.tabKey} onSelect={this.handleTabSelect.bind(this)}>
                            <Bs.NavItem eventKey={1}>公司信息</Bs.NavItem>
                            <Bs.NavItem eventKey={2}>资质 <Bs.Badge>{typeof companyData.zizhi!="undefined"?companyData.zizhi.length:"0"}</Bs.Badge></Bs.NavItem>
                            <Bs.NavItem eventKey={3}>人员 <Bs.Badge>{typeof companyData.person!="undefined"?companyData.person.length:"0"}</Bs.Badge></Bs.NavItem>
                            <Bs.NavItem eventKey={4}>业绩</Bs.NavItem>
                        </Bs.Nav>
                    </Bs.Col>
                </Bs.Row>
                {tabContent}
            </Bs.Grid>
        );
    }
}

export default CompanyDetail;
