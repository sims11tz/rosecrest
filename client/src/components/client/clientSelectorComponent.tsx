import { useEffect, useState } from "react";


import './clientComponent.css';

function ClientSelectorComponent() {


	let style:React.CSSProperties = {
		// backgroundColor: 'rgba(255, 0, 0, 0.5)',
	}

	useEffect(() => { 

		console.log(' clientSelector init() ---- ');

	
	}, []);

	return (
		<div className="clientContainer">
			<div></div>
		</div>
	)
}

export default ClientSelectorComponent;