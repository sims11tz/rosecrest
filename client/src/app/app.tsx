import { AppDataProvider, useData } from './appDataProvider';
import { HeaderComponent } from 'components/headerComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardComponent from 'components/dashboard/dashboardComponent';
import CategoriesComponent from 'components/categories/categoriesComponent';
import TransactionsComponent from 'components/transactions/transactionsComponent';
import GroupsComponent from 'components/groups/groupsComponent';
import TagsComponent from 'components/tags/tagsComponents';
import { ContextMenu } from 'components/contextMenu/contextMenuComponent';
import React, { useState } from 'react';
import { ENDPOINT_GROUPS, ENDPOINT_TAGS } from '@shared/SharedNetworking';

import './app.css';
import { AgCharts } from 'ag-charts-enterprise';

function App()
{
	let licenseKey = process.env.REACT_APP_AG_CHARTS_LICENSE;
	if (licenseKey)
	{
		AgCharts.setLicenseKey(licenseKey);
	}

	const [menuState, setMenuState] = useState({isVisible: false,x: 0,y: 0});
	const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.preventDefault();
		
		setMenuState({ isVisible: true, x: event.pageX, y: event.pageY });
	};

	const handleClick = () => {
		if (menuState.isVisible) {
			setMenuState({ ...menuState, isVisible: false });
		}
	};

	return (
		<BrowserRouter>
			<div id="theAppComponent" onContextMenu={handleContextMenu} onClick={handleClick}>
				<ContextMenu x={menuState.x} y={menuState.y} isVisible={menuState.isVisible}/>
				<HeaderComponent />
				<AppDataProvider>
					<AppContent/>
				</AppDataProvider>
			</div>
		</BrowserRouter>
	);
}

const AppContent = React.memo(() => {
	const { isInitialized } = useData();

	return (
		<div id="routerContainer">
			{ !isInitialized ? (
				<div>Initializing...</div>
			) : (
				<div id="routesContainer">
					<Routes>
						<Route path="/" element={<DashboardComponent />} />
						<Route path="/transactions" element={<TransactionsComponent />} />
						<Route path="/categories" element={<CategoriesComponent />} />
						<Route path="/groups" element={<GroupsComponent network_endpoint={ENDPOINT_GROUPS}/>} />
						<Route path="/tags" element={<TagsComponent network_endpoint={ENDPOINT_TAGS}/>} />
					</Routes>
				</div>
			)}
		</div>
	);
});

export default App;