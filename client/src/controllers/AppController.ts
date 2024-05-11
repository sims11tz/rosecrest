import { AccountObj, CategoryObj, MemberObj } from "@shared/DataTypes";
import { NETWORK_COMMANDS, NETWORK_ENDPOINTS } from "@shared/SharedNetworking";
import Networking from "utils/Networking";

export default class AppController {

	static myInstance: AppController;
	static get() { if (AppController.myInstance == null) { AppController.myInstance = new AppController(); } return this.myInstance; }

	constructor() { }

	private _appInitialized:boolean = false;
	public get appInitialized  () { return this._appInitialized; }

	private _initCalled:boolean = false;
	public async init(completeCallback: () => void)
	{
		if (this._initCalled)
		{
			console.log("AppController.init() already called, skipping.");
			return;
		}
		this._initCalled = true;

		console.log(" ______APPController.INIT(*)_______________________________ ");
		//LOAD members, accounts, categories

		try {
			await Promise.all([
				this.loadMembers(),
				this.loadAccounts(),
				this.loadCategories()
			]);
			console.log("All data loaded, app initialized.");
			this._appInitialized = true;
			completeCallback();
		} catch (error) {
			console.error("Failed to initialize app:", error);
		}	
	}

	private _members:MemberObj[] = [];
	public get Members():MemberObj[] { return this._members; }
	private async loadMembers()
	{
		return new Promise((resolve, reject) => {
			Networking.fetch<MemberObj[]>(NETWORK_ENDPOINTS.MEMBERS, NETWORK_COMMANDS.MEMBERS_FETCH_ALL, {}, (data, error) => {
				if (error){
					console.error('Error fetching members:', error);
					reject(error);
				} else {
					console.log("Loaded Members : "+data?.length);
					this._members = data || [];
					resolve(data);
				}
			});
		});
	}
	
	private _accounts:AccountObj[] = [];
	public get Accounts():AccountObj[] { return this._accounts; }
	private async loadAccounts()
	{
		return new Promise((resolve, reject) => {
			Networking.fetch<AccountObj[]>(NETWORK_ENDPOINTS.ACCOUNTS, NETWORK_COMMANDS.ACCOUNTS_FETCH_ALL, {}, (data, error) => {
				if (error){
					console.error('Error fetching accounts:', error);
					reject(error);
				} else {
					console.log("Loaded Accounts : "+data?.length);
					this._accounts = data || [];
					resolve(data);
				}
			});
		});
	}

	private _categories:CategoryObj[] = [];
	public get Categories():CategoryObj[] { return this._categories; }
	private async loadCategories()
	{
		return new Promise((resolve, reject) => {
			Networking.fetch<CategoryObj[]>(NETWORK_ENDPOINTS.CATEGORIES, NETWORK_COMMANDS.CATEGORIES_FETCH_ALL, {}, (data, error) => {
				if (error){
					console.error('Error fetching categories:', error);
					reject(error);
				} else {
					console.log("Loaded Categories : "+data?.length);
					this._categories = data || [];
					resolve(data);
				}
			});
		});
	}
}