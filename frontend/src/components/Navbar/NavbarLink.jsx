import React from 'react';
import { Link } from 'react-router-dom';

function NavbarLink({ link, text, closeFunction }) {
	return (
		<>
			<Link to={link} onClick={() => closeFunction()} reloadDocument>
				{text}
			</Link>
		</>
	);
}

export default NavbarLink;
