import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import LogoutButton from './LogoutButton';
import EmailNotify from './EmailNotify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './StyleFH.css'; 

const Header = ({ userName, userType }) => {
    return (
        <header>
            <nav>
                <ul className="nav-items">
                    <li><Link to={`/Admin`}>Home</Link></li>
                    <li><EmailNotify /></li>
                    <li><LogoutButton /></li>
                    <li className="user-info">
                        <FontAwesomeIcon icon={faUser} className="user-icon" />
                        <span className="username">{userName}</span>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
