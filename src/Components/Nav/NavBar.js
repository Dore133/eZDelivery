import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="red">
		<div className="nav-wrapper">
			<Link to="/" className="brand-logo center">eZ Delivery</Link>
		</div>
	</nav>
  );
}

export default Header;
