import { service_list } from "@shared/CustomDefs";
import AppController from "controllers/AppController";
import { useEffect, useState } from "react";
import { ServerComponent } from "./serverComponent";

import './dashboardComponent.css';

function DashboardComponent() {

	let style:React.CSSProperties = {
		// backgroundColor: 'rgba(255, 0, 0, 0.5)',
	}

	useEffect(() => { 

		console.log(' SUP BITCH dashbaord init() ---- ');

	
	}, []);

	return (
		<div className="serverGridContainer">
			<div style={style} className="serverGrid">
				{AppController.get().Servers.map((serverObj, index) => (
					<ServerComponent key={"serverNode_"+index} serverObj={serverObj}/>
				))}
			</div>
		</div>
	)
}

export default DashboardComponent;