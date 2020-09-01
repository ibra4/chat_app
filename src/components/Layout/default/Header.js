import React from 'react'

import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'

import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/chat/index">Chat</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link className="nav-link" to="/chat/rooms">Rooms</Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header