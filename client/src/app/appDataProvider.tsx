import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AppController from 'controllers/AppController';

interface DataContextValue {
	isInitialized: boolean;
}

const DataContext = createContext<DataContextValue>({
	isInitialized: false,
});

interface AppDataProviderProps { children: ReactNode; }

export const AppDataProvider = ({ children }: AppDataProviderProps) => {
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const controller = AppController.get();
		controller.init(() => {
			setIsInitialized(true);
		});
	}, []);

const value = { isInitialized };

return (
	<DataContext.Provider value={value}>
		{children}
	</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);