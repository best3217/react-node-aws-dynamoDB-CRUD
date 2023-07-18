import React from 'react';
import { Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <Navbar
      fluid
      rounded
    >
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Link to={'/'}>
        <Navbar.Link
          active
        >
          <p>
            Home
          </p>
        </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  )
}


