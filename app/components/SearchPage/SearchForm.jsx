import React, { PropTypes,Form } from 'react'
import * as Bs from "React-Bootstrap"
import 'whatwg-fetch'

const popoverDeleteCondition=(
    <Bs.Tooltip placement="top" className="in" id="tooltip-top">
        Tooltip top
    </Bs.Tooltip>
);
var conditionOptions;
class SearchForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            conditionFormOptions:{},
            conditionFormSelected:[-1],
            conditionBlocks:{zizhi:[],person:[],special:[],performance:{keyword:"",startMoney:0,startTime:-1}},
            condition1Options:{},
            condition2Options:{},
            condition3Options:{},
            conditionModel:{
                show:false,
                title:"",
                type:"",
                alertText:"",
                onSubmit:()=>{},
            }
        };
        this.openConditionModel=this.openConditionModel.bind(this);
        this.closeConditionModel=this.closeConditionModel.bind(this);
        this.addCondition=this.addCondition.bind(this);
        this.getModelBody=this.getModelBody.bind(this);
        this.handelPerformance=this.handelPerformance.bind(this);

    }
    handelChange(event){
        console.log(event.target.name);
    }

    componentDidMount(){
        var that=this;
        fetch('./assets/condition_options.json')
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            conditionOptions=json;
            that.initZiZhiState();
        }).catch(function(error) {
            console.log('parsing failed', error)
        })
    }

    initConditionState(type){
        this.setState({
            conditionFormOptions:conditionOptions[type],
            conditionFormSelected:[-1]
        });
    }

    selectConditionOption(id,event){
        var target=event.target;
        var conditionFormSelected=this.state.conditionFormSelected;
        var conditionFormOptions=this.state.conditionFormOptions;
        conditionFormSelected[id]=target.value;
        if(id<conditionFormSelected.length-1){
            conditionFormSelected.splice(id+1);
        }
        var stillHaveSub=true;
        for(var i=0;i<=id;i++){
            var selectedValue=conditionFormSelected[i];
            if(typeof conditionFormOptions.subs[selectedValue].subs != "undefined" && conditionFormOptions.subs[selectedValue].subs.length>0){
                stillHaveSub=true;
                conditionFormOptions=conditionFormOptions.subs[selectedValue];
            }else{
                stillHaveSub=false;
            }
        }
        if(stillHaveSub){
            conditionFormSelected.push(-1);
        }
        this.setState({
            conditionFormSelected:conditionFormSelected
        });
    }

    openConditionModel(type){
        var title="";
        switch (type) {
            case "zizhi":
                title="资质条件"
                break;
            case "person":
                title="人员条件"
                break;
            case "special":
                title="特殊条件"
                break;
            default:

        }
        var conditionModel={
            show:true,
            title:title,
            type:type,
            alertText:"",
            onSubmit:this.addCondition.bind(this,type)
        }
        this.initConditionState.call(this,type);
        this.setState({conditionModel:conditionModel});
    }

    addCondition(type,event){
        event.preventDefault();
        var conditionFormOptions=this.state.conditionFormOptions;
        var conditionFormSelected=this.state.conditionFormSelected;
        var conditionModel=this.state.conditionModel;
        var checkPass=true;
        console.log(conditionFormSelected);
        for (var i = 0; i < conditionFormSelected.length; i++) {
            if(conditionFormSelected[i]==-1){
                checkPass=false;
            }
        }
        if(!checkPass){
            conditionModel.alertText="请将条件选完！";
            this.setState({conditionModel:conditionModel});
            return;
        }

        var result=[];
        for(var i=0;i<conditionFormSelected.length;i++){
            var selected=conditionFormSelected[i];
            if(selected==-1){
                continue;
            }
            var selectedStr=conditionFormOptions.subs[selected].text;
            result.push(selectedStr);
            if(i!=conditionFormSelected.length-1){
                conditionFormOptions=conditionFormOptions.subs[selected];
            }
        }
        var resultStr=result.join(':');

        var conditionBlocks=this.state.conditionBlocks;
        if(typeof conditionBlocks[type] == "undefined"){
            conditionBlocks[type]=[];
        }
        if(conditionBlocks[type].indexOf(resultStr)!=-1){
            conditionModel.alertText="此条件已存在！";
            this.setState({conditionModel:conditionModel});
            return;
        }else{
            conditionBlocks[type].push(resultStr);
            this.setState({conditionBlocks:conditionBlocks});
            this.closeConditionModel();
        }
    }

    closeConditionModel(){
        var conditionModel=this.state.conditionModel;
        conditionModel.show=false;
        this.setState({conditionModel:conditionModel});
    }

    getModelBody(){
        if (this.state.conditionModel.type=="zizhi" || this.state.conditionModel.type=="person" || this.state.conditionModel.type=="special") {
            var that=this;
            var conditionForms=[];
            var formOption=this.state.conditionFormOptions;
            var subPlaceHolder=formOption.subPlaceHolder;
            var subs=formOption.subs;
            for(var id=0;id<this.state.conditionFormSelected.length;id++){
                var selected=this.state.conditionFormSelected[id];
                conditionForms.push(
                    <Bs.Col sm={4} key={id}>
                        <Bs.FormControl componentClass="select" placeholder={subPlaceHolder} onChange={that.selectConditionOption.bind(that,id)} value={selected}>
                            <option value={-1} key={-1}>{subPlaceHolder}</option>
                            {subs.map(function(obj,i){
                                return(<option value={i} key={i}>{obj.text}</option>)
                            })}
                        </Bs.FormControl>
                    </Bs.Col>
                );
                if((typeof subs[selected] != "undefined") && (typeof subs[selected].subs != "undefined") && subs[selected].subs.length>0){
                    formOption=subs[selected];
                    subPlaceHolder=formOption.subPlaceHolder;
                    subs=formOption.subs;
                    selected=-1;
                }else{
                    formOption=null;
                    break;
                }
            };
            if(formOption!=null){
                conditionForms.push(
                    <Bs.Col sm={4} key={id}>
                        <Bs.FormControl componentClass="select" placeholder={subPlaceHolder} onChange={that.selectConditionOption.bind(that,id)} value={selected}>
                            <option value={-1} key={-1}>{subPlaceHolder}</option>
                            {subs.map(function(obj,i){
                                return(<option value={i} key={i}>{obj.text}</option>)
                            })}
                        </Bs.FormControl>
                    </Bs.Col>
                );
            }
            return(
                <Bs.Row key={0} className="model-row">
                    {conditionForms}
                </Bs.Row>
            )
        }
    }

    removeCondition(type,id){
        console.log(type+":"+id);
        var conditionBlocks=this.state.conditionBlocks;
        conditionBlocks[type].splice(id,1);
        this.setState({conditionBlocks:conditionBlocks});
    }

    handelPerformance(fieldName,event){
        var field=fieldName;
        var value=event.target.value;
        var performance={};
        if(typeof this.state.conditionBlocks.performance != 'undefined'){
            performance = this.state.conditionBlocks.performance;
        }
        performance[field]=value;
        this.setState({performance:performance});
    }

    render () {
        var modelBody=this.getModelBody();

        return(
            <div>
                <Bs.PageHeader><small>企业搜索</small></Bs.PageHeader>
                <Bs.Grid className="search-form">
                    <Bs.Row>
                        <Bs.Col md={1} sm={2} xs={12} className="text-left">
                            <h5 className="condition-field-name">资质</h5>
                        </Bs.Col>
                        <Bs.Col md={11} sm={10} xs={12}>
                            {typeof this.state.conditionBlocks['zizhi'] != "undefined" && this.state.conditionBlocks['zizhi'].map((condition,i)=>{
                                return (
                                    <div key={i} className="condition-block">
                                        {condition} <Bs.Glyphicon onClick={this.removeCondition.bind(this,"zizhi",i)} glyph="remove"  className="remove-btn"/>
                                    </div>
                                );
                            })}
                            <Bs.Button bsSize="small" key={-1} onClick={this.openConditionModel.bind(this,"zizhi")} className="condition-add-btn" bsStyle="primary">添加资质条件</Bs.Button>
                        </Bs.Col>
                    </Bs.Row>
                    <hr className="hr"></hr>
                    <Bs.Row>
                        <Bs.Col md={1} sm={2} xs={12} className="text-left">
                            <h5 className="condition-field-name">人员</h5>
                        </Bs.Col>
                        <Bs.Col md={11} sm={10} xs={12}>
                            {typeof this.state.conditionBlocks['person'] != "undefined" && this.state.conditionBlocks['person'].map((condition,i)=>{
                                return (
                                    <div key={i} className="condition-block">
                                        {condition} <Bs.Glyphicon onClick={this.removeCondition.bind(this,"person",i)} glyph="remove"  className="remove-btn"/>
                                    </div>
                                );
                            })}
                            <Bs.Button bsSize="small" key={-1} onClick={this.openConditionModel.bind(this,"person")} className="condition-add-btn" bsStyle="primary">添加人员条件</Bs.Button>
                        </Bs.Col>
                    </Bs.Row>
                    <hr className="hr"></hr>
                    <Bs.Row>
                        <Bs.Col md={1} sm={2} xs={12} className="text-left">
                            <h5 className="condition-field-name">特殊条件</h5>
                        </Bs.Col>
                        <Bs.Col md={11} sm={10} xs={12}>
                            {typeof this.state.conditionBlocks['special'] != "undefined" && this.state.conditionBlocks['special'].map((condition,i)=>{
                                return (
                                    <div key={i} className="condition-block">
                                        {condition} <Bs.Glyphicon onClick={this.removeCondition.bind(this,"special",i)} glyph="remove"  className="remove-btn"/>
                                    </div>
                                );
                            })}
                            <Bs.Button bsSize="small" key={-1} onClick={this.openConditionModel.bind(this,"special")} className="condition-add-btn" bsStyle="primary">添加特殊条件</Bs.Button>
                        </Bs.Col>
                    </Bs.Row>
                    <hr className="hr"></hr>
                    <Bs.Row>
                        <Bs.Col md={1} sm={2} xs={12} className="text-left">
                            <h5 className="condition-field-name">业绩条件</h5>
                        </Bs.Col>
                        <Bs.Col md={11} sm={10} xs={12} className="performance-condition-block">
                            <Bs.Col sm={4} xs={12}>
                                <Bs.FormControl type="text" placeholder="关键词(如：土地整理、道路、桥等)" onChange={this.handelPerformance.bind(this,"keyword")} value={this.state.conditionBlocks.performance.keyword} />
                            </Bs.Col>
                            <Bs.Col sm={4} xs={12}>
                                <Bs.InputGroup>
                                    <Bs.FormControl type="number" placeholder="起始金额" onChange={this.handelPerformance.bind(this,"startMoney")} value={this.state.conditionBlocks.performance.startMoney} />
                                    <Bs.InputGroup.Addon>万元以上</Bs.InputGroup.Addon>
                                </Bs.InputGroup>
                            </Bs.Col>
                            <Bs.Col sm={4} xs={12}>
                                <Bs.FormControl componentClass="select" placeholder="全部时间" onChange={this.handelPerformance.bind(this,"startTime")} value={this.state.conditionBlocks.performance.startTime}>
                                    <option value={-1} key={-1}>全部时间</option>
                                    <option value={3} key={3}>三年内</option>
                                    <option value={5} key={5}>五年内</option>
                                </Bs.FormControl>
                            </Bs.Col>
                        </Bs.Col>
                    </Bs.Row>
                    <hr className="hr"></hr>
                    <Bs.Row>
                        <Bs.Col md={1} sm={2} xs={12} className="text-left">
                        </Bs.Col>
                        <Bs.Col md={11} sm={10} xs={12}>
                            <Bs.Button bsStyle="primary" onClick={this.props.onFormSubmited.bind(this,this.state.conditionBlocks)}>&nbsp;&nbsp;&nbsp;搜索&nbsp;&nbsp;&nbsp;</Bs.Button>
                        </Bs.Col>
                    </Bs.Row>
                </Bs.Grid>
                <Bs.Modal show={this.state.conditionModel.show} onHide={this.closeConditionModel}>
                    <form onSubmit={this.state.conditionModel.onSubmit}>
                        <Bs.Modal.Header closeButton>
                            <Bs.Modal.Title>{this.state.conditionModel.title}</Bs.Modal.Title>
                        </Bs.Modal.Header>
                        <Bs.Modal.Body>
                            {modelBody}
                        </Bs.Modal.Body>
                        <Bs.Modal.Footer>
                            <Bs.Row key={0} className="model-row">
                                <Bs.Col key={0} xs={6}>
                                {(this.state.conditionModel.alertText=="")?"":(
                                    <Bs.Alert bsStyle="danger" className="condition-alert">
                                        {this.state.conditionModel.alertText}
                                    </Bs.Alert>
                                )}
                                </Bs.Col>
                                <Bs.Col key={1} xs={6}>
                                    <Bs.Button type="submit">添加</Bs.Button>
                                </Bs.Col>
                            </Bs.Row>
                        </Bs.Modal.Footer>
                    </form>
                </Bs.Modal>
            </div>
        );
    }
}

export default SearchForm;
