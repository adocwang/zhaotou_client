import React, { PropTypes } from 'react'
import 'whatwg-fetch'
import Config from '../../config/Config'

import Menu from '../Menu/Menu';
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";

require("./SearchPage.css")



class SearchPage extends React.Component {
    tempData={
        conditionBlocks:{},
        page:1
    }
    constructor(props){
        super(props);
        this.state={
            searchResult:{},
            page:1
        }
        this.setConditions=this.setConditions.bind(this);
        this.doSearch=this.doSearch.bind(this);
        this.onSearchResult=this.onSearchResult.bind(this);
        this.changePage=this.changePage.bind(this);
    }

    setConditions(conditionBlocks,event){
        this.tempData={conditionBlocks:conditionBlocks,page:1};
        this.doSearch();
    }

    doSearch(){
        var conditionBlocks=this.tempData.conditionBlocks;
        var that=this;
        var data={condition:conditionBlocks,page:this.tempData.page};
        console.log(data);
        fetch(Config.api_base_url+"/search_company",
        {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(function(response) {
            return response.json()
        }).then(function(res){ that.onSearchResult(res); })
        .catch(function(res){ that.onSearchError(res) })
        // console.log(conditionBlocks);
    }

    onSearchResult(res){
        this.setState({searchResult:res});
    }

    onSearchError(res){
        console.log("search error");
    }

    changePage(page){
        this.tempData.page=page;
        this.doSearch();
    }

    render () {
        // console.log(this.state.searchResult);
        return (
            <div className="main-content">
                <SearchForm onFormSubmited={this.setConditions}/>
                {(typeof this.state.searchResult.pageCount != "undefined")?<SearchResult resultData={this.state.searchResult} onPageChange={this.changePage}/>:""}
            </div>
        );
    }
}

export default SearchPage;
