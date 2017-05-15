import React, { PropTypes } from 'react'
import * as Bs from "React-Bootstrap"
import { Link } from 'react-router';

class SearchResult extends React.Component {
    constructor(props){
        super(props);
        this.handlePageSelect=this.props.onPageChange;
    }
    render () {
        var lines=[];
        console.log(this.props.resultData);
        var companies=this.props.resultData.data;
        var pageSize=this.props.resultData.pageSize;
        var pageCount=this.props.resultData.pageCount;
        var page=this.props.resultData.page;
        if(companies.length>0){
            lines.push(
                <Bs.Row key={0} className="search-result-header">
                    <Bs.Col sm={1} xs={12} xsHidden>#</Bs.Col>
                    <Bs.Col sm={5} xs={12} xsHidden>公司名称</Bs.Col>
                    <Bs.Col sm={2} xs={12} xsHidden>法人法人</Bs.Col>
                    <Bs.Col sm={2} xs={12} xsHidden>人员数量</Bs.Col>
                    <Bs.Col sm={2} xs={12} xsHidden>操作</Bs.Col>
                </Bs.Row>
            );
            for(var i=0;i < companies.length;i++){
                var comp=companies[i];
                lines.push(
                    <Bs.Row key={(i+1)} className="search-result-row">
                        <Bs.Col smHidden mdHidden lgHidden xs={4}>#</Bs.Col>
                        <Bs.Col sm={1} xs={8} >{(i+1+(page-1)*pageSize)}</Bs.Col>
                        <Bs.Col smHidden mdHidden lgHidden xs={4}>公司名称</Bs.Col>
                        <Bs.Col sm={5} xs={8} ><Link to={"/company_detail/"+comp.compId}>{comp.compName}</Link></Bs.Col>
                        <Bs.Col smHidden mdHidden lgHidden xs={4}>公司法人</Bs.Col>
                        <Bs.Col sm={2} xs={8} >{comp.legalMan}</Bs.Col>
                        <Bs.Col smHidden mdHidden lgHidden xs={4}>人员数量</Bs.Col>
                        <Bs.Col sm={2} xs={8} >{comp.personCount}</Bs.Col>
                        <Bs.Col smHidden mdHidden lgHidden xs={4}>操作</Bs.Col>
                        <Bs.Col sm={2} xs={8} ><Link to={"/company_detail/"+comp.compId}>查看详情</Link></Bs.Col>
                    </Bs.Row>
                );
            }
        }
        return (
            <div>
                <Bs.PageHeader><small>搜索结果</small></Bs.PageHeader>
                <Bs.Grid>
                    {pageCount>0?(
                        <div>
                            {lines}
                            <Bs.Pagination
                            prev
                            next
                            ellipsis
                            boundaryLinks
                            items={pageCount}
                            maxButtons={5}
                            activePage={page}
                            onSelect={this.handlePageSelect} />
                        </div>
                    ):(
                        <Bs.Alert bsStyle="info">
                            没有找到符合条件的公司，请重试！
                        </Bs.Alert>
                    )}
                </Bs.Grid>
            </div>
        );
    }
}

export default SearchResult;
