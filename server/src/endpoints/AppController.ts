import { ServerObj } from "@shared/DataTypes";

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
			console.log("AppController. init( ) al r eady  called, skipping.");
			return;
		}
		this._initCalled = true;

		console.log(" ______APPController.INIT(*)_______________________________ ");

		this._servers = new Array<ServerObj>();
		const serverListString: string = process.env.REACT_APP_SERVER_LIST || '';
		console.log(" serverListString: ",serverListString);
		const servers: string[] = serverListString.split(',');
		servers.forEach(server => {
			
			let serverObj: ServerObj = {
				alias: server,
				ip: process.env[server+'_ip'] || '',
				port_external: process.env[server+'_port'] || ''
			};

			this._servers.push(serverObj);
		});

		console.log(" this._servers: ",this._servers);
		
		try {
			await Promise.all([
				
			]);
			console.log("All data loaded, app initialized. ");
			this._appInitialized = true;
			completeCallback();
		} catch (error) {
			console.error("Failed to initialize app:", error);
		}	
	}


	private _servers:ServerObj[] = [];
	public get Servers():ServerObj[] { return this._servers; }

}