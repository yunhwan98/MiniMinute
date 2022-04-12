import React, { Component } from "react";

class AddParticipant extends Component{
    constructor() {
        super();
        this.state = {
            value: "",
            nameList: [],
        };
    }

    getValue = (e) => {
        this.setState({
            value: e.target.value,
        })
    }

    enterClick = (e) => {
        if(e.key === "Enter"){
            this.addName();
            e.target.value = "";    //엔터 후 입력값 초기화
        }
    }

    addName = () => {
        this.setState({
            nameList: this.state.nameList.concat([this.state.value]),
            value: ""  //버튼 클릭 후 입력값을 초기화하는 것 같은데 input에 그대로 남음
        })
    }

    render() {
        return (
            <div className="participant-list">
                <ul className="participant-ul">
                    {this.state.nameList.map((name, idx) => {
                        return <li key={idx} className="footer-li">{name}</li>
                    })}
                </ul>
                <div>
                    <input type="text" className="part-input" id="participant"
                           onChange={this.getValue}
                           onKeyPress={this.enterClick}/>
                    <button type="button" className="setting-btn" onClick={this.addName}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                             className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path
                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        )
    }
}

export default AddParticipant;