import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {
    return (
        <div className="container-fluid">
            <div className="row mt-4 mb-3">
                <div className="col-md-3 text-left">
                    <Link to="/" className="h4 text-dark ml-3 text-decoration-none">Project 101</Link>
                </div>
                <div className="col-md-6 text-center">
                    <ul className="nav justify-content-center">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/setting">Setting</Link></li>
                    </ul>
                </div>
            </div>
            <hr />
        </div>
    )
}

export default Header;