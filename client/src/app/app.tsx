import { HeaderComponent } from 'components/headerComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import { AppDataProvider, useData } from './appDataProvider';
import DashboardComponent from 'components/dashboard/dashboardComponent';

import './app.css';
import ClientComponent from 'components/client/clientComponent';
import RosecrestComponent from 'components/rosecrest/rosecrest';
import ClientSelectorComponent from 'components/client/clientSelectorComponent';

function App()
{

	return (
		<BrowserRouter>
			<div id="theAppComponent">
				<HeaderComponent />
				<AppDataProvider>
					<div className='appContentWrapper'>
						<AppContent/>
					</div>
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
						<Route path="/" element={<RosecrestComponent />} />
						<Route path="/client" element={<ClientSelectorComponent />} />
						<Route path="/client/:clientIdParam" element={<ClientComponent />} />
						<Route path="/dashboard" element={<DashboardComponent />} />
					</Routes>
				</div>
			)}
		</div>
	);
});

export default App; 