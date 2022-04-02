import React from "react";
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/home" className="header-link">Mini Minutes</Link>
                </div>
                <div className="search-log">
                    <form className="container-fluid">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </span>
                            <input type="text" className="form-control" placeholder="회의록 검색" aria-label="meeting log"
                                   aria-describedby="basic-addon1" />
                        </div>
                    </form>
                    {/*<span>*/}
                    {/*<button type="submit" className="search-btn">*/}
                    {/*    <svg xmlns="http://www.w3.org/2000/svg" height="27" viewBox="0 0 27 27" width="27"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>*/}
                    {/*</button>*/}
                    {/*</span>*/}
                    {/*<input type="text" className="header-input" placeholder="회의록 검색" />*/}
                    </div>
            </div>
        </div>
    );
};

export default Header;