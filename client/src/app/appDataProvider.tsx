import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccountObj, CategoryObj, MemberObj, TransactionObj } from "@shared/DataTypes";
import AppController from 'controllers/AppController';

interface DataContextValue {
	members: MemberObj[];
	accounts: AccountObj[];
	categories: CategoryObj[];
	isInitialized: boolean;
	activeRows: TransactionObj[];
	setActiveRows: (rows: TransactionObj[]) => void;
}

const DataContext = createContext<DataContextValue>({
	members: [],
	accounts: [],
	categories: [],
	isInitialized: false,
	activeRows: [],
	setActiveRows: () => { }
});

interface AppDataProviderProps { children: ReactNode; }

export const AppDataProvider = ({ children }: AppDataProviderProps) => {
	const [members, setMembers] = useState<MemberObj[]>([]);
	const [accounts, setAccounts] = useState<AccountObj[]>([]);
	const [categories, setCategories] = useState<CategoryObj[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);
	const [activeRows, setActiveRows] = useState<TransactionObj[]>([]);

	useEffect(() => {
		const controller = AppController.get();
		controller.init(() => {
			setMembers(controller.Members);
			setAccounts(controller.Accounts);
			setCategories(controller.Categories);
			setIsInitialized(true);
			setActiveRows([]);
		});
	}, []);

const value = { members, accounts, categories, isInitialized, activeRows, setActiveRows };

return (
	<DataContext.Provider value={value}>
		{children}
	</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);