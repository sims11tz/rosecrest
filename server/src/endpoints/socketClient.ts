import { CLIENT_NODE_ACTION_STATE, SendPacketObj, SERVER_CALL_TYPE, SERVER_RESPONSE_TYPE, ServerCallMessageObj, ServerResponseMessageObj } from "@shared/DataTypes";
import WebSocket, { WebSocketServer } from 'ws';
import Log from "../utils/Log";
import MiscUtils from "@shared/MiscUtils";

export class SocketClient {
	private static instance: SocketClient;
	public static get(): SocketClient { if (!SocketClient.instance) { SocketClient.instance = new SocketClient(); } return SocketClient.instance; }
	constructor() {};
	
	private _wss!:WebSocketServer;
	public setWss(wss:WebSocketServer)
	{
		this._wss = wss;
	}

	public CallAnotherServer(serverCallObj: ServerCallMessageObj): Promise<ServerResponseMessageObj[]>
	{
		return new Promise(async (resolve, reject) => {

			Log.info('CallAnotherServer : ',serverCallObj);

			let sendPacketObj: SendPacketObj = serverCallObj.data as SendPacketObj;
			let targets = sendPacketObj.target.split(',');

			Log.info('targets : ',targets);

			// Map each target to a WebSocket connection promise
			const promises = targets.map(target => this.connectAndSendMessage(target, serverCallObj));

			try {
				const results = await Promise.all(promises);
				resolve(results);
			} catch (error) {
				reject(error);
			}
		});
	}

	private async connectAndSendMessage(target: string, serverCallObj: ServerCallMessageObj): Promise<ServerResponseMessageObj>
	{
		return new Promise((resolve, reject) => {

			Log.info('connectAndSendMessage');

			const target_ip = process.env[`${target}_ip`];
			const target_port_external = process.env.socket_port;

			const url = `ws://${target_ip}:${target_port_external}/ws/`;
			const wsc = new WebSocket(url);
			let startTime: number=0;

			wsc.on('open', () => {
				try {
					startTime = Date.now();
					wsc.send(JSON.stringify(serverCallObj));
				} catch (error) {
					console.error('Error opening WebSocket:', error);
					wsc.close();
					reject(error);
				}
			});

			wsc.on('message', (message: string) => {
				try {
					const serverResponseMessageObj: ServerResponseMessageObj = JSON.parse(message);
					serverResponseMessageObj.target = target;
					if ([SERVER_RESPONSE_TYPE.MESSAGE,SERVER_RESPONSE_TYPE.CLIENT_MESSAGE].includes(serverResponseMessageObj.responseType)) {

						serverResponseMessageObj.callTime = Date.now() - startTime;

						resolve(serverResponseMessageObj);
						wsc.close();
					}
				} catch (error) {
					console.error('Error handling message:', error);
					wsc.close();
					reject(error);
				}
			});

			wsc.on('error', (error: Error) => {
				console.error('WebSocket error:', error);
				wsc.close();
				reject(error);
			});

			wsc.on('close', () => {
				// console.log('Disconnected from the server');
			});
		});
	}

	public async SendToAllClients(clientMessage: ServerResponseMessageObj)
	{
		return new Promise((resolve, reject) => {

			let idx:number = 0;
			this._wss.clients.forEach(client => {
				idx++;
				if (client.readyState === WebSocket.OPEN)
				{
					client.send(JSON.stringify(clientMessage));
				}
			});

			resolve({message:'sent to '+idx+' clients'});
		});
	}

	public async AllTargetClientsListenMode(serverCallObj:ServerCallMessageObj)
	{
		Log.info('_______________________');
		Log.info('_______________________');
		Log.info('_______________________');
		Log.info('_______________________');
		Log.info('AllTargetClientsListenMode : ',serverCallObj);

		//Tell targets clients to go into listen mode
		let serverCallObjListening:ServerCallMessageObj = {
			...serverCallObj,
			callType:SERVER_CALL_TYPE.RELAY_TO_ALL_CLIENTS,
			data: {
				...serverCallObj.data,
				deltaCallType:serverCallObj.callType,
				clientState:CLIENT_NODE_ACTION_STATE.LISTENING,
				message:"listen mode please",
				delta:process.env.SERVER_ALIAS
			}
		};
		console.log('serverCallObjListening:',serverCallObjListening);
		Log.info('_______________________');
		Log.info('_______________________');
		Log.info('_______________________');
		
		await this.CallAnotherServer(serverCallObjListening);
	}
	
	public async AllMyClientsShowCountDown(countfrom:number=5)
	{
		//Show CountDown on my clients
		let clientMessage:ServerResponseMessageObj = {
			callId: -1,
			callTime: 0,
			responseType: SERVER_RESPONSE_TYPE.CLIENT_MESSAGE,
			clientState: CLIENT_NODE_ACTION_STATE.COUNTDOWN,
			clientData: {countdown:5},
			message: "preparing packet send operation"
		};

		for(let x:number=countfrom; x>=0; x--)
		{
			await MiscUtils.GhettoWait(1000);
			clientMessage.clientData = {countdown:x};
			await this.SendToAllClients(clientMessage);
		}
	}

	public async AllMyClientsShowResults(wsResponses:ServerResponseMessageObj[])
	{
		//Tell my clients to show the results
		let clientResultsMessage:ServerResponseMessageObj = {
			callId: -1,
			callTime: 0,
			responseType: SERVER_RESPONSE_TYPE.CLIENT_MESSAGE,
			clientState: CLIENT_NODE_ACTION_STATE.RESULTS,
			clientData: {countdownResults:wsResponses},
			message: "preparing packet send operation"
		};
		await this.SendToAllClients(clientResultsMessage);
	}

}