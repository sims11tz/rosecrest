import { useEffect, useState } from "react";

import './clientComponent.css';

function ClientComponent() {

	let style:React.CSSProperties = {
		// backgroundColor: 'rgba(255, 0, 0, 0.5)',
	}

	useEffect(() => { 

		console.log(' SUP BITCH dashbaord init() ---- ');

	
	}, []);

	return (
		<div className="clientContainer">
			THIS IS A CLIENT! hoooray
		</div>
	)
}

export default ClientComponent;