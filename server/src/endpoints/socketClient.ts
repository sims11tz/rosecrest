import { SendPacketObj, SERVER_CALL_TYPE, SERVER_RESPONSE_TYPE, ServerCallMessageObj, ServerResponseMessageObj } from "@shared/DataTypes";
import WebSocket, { WebSocketServer } from 'ws';
import Log from "../utils/Log";

export class SocketClient {
	private static instance: SocketClient;
	public static get(): SocketClient { if (!SocketClient.instance) { SocketClient.instance = new SocketClient(); } return SocketClient.instance; }
	constructor() {};
	
	public CallAnotherServer(serverCallObj: ServerCallMessageObj): Promise<ServerResponseMessageObj[]>
	{
		return new Promise(async (resolve, reject) => {
			let sendPacketObj: SendPacketObj = serverCallObj.data as SendPacketObj;
			let targets = sendPacketObj.target.split(',');

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
			const target_ip = process.env[`${target}_ip`];
			const target_port_external = '7002'; // process.env[`${target}_port`]; If you need to fetch from env, uncomment this line.

			const url = `ws://${target_ip}:${target_port_external}`;
			const wsc = new WebSocket(url);
			let startTime: number=0;

			wsc.on('open', () => {
				try {
					// let packetObj: ServerCallMessageObj = {
					// 	callId: 1,
					// 	callType: serverCallObj.callType,
					// 	data: {}
					// };
					startTime = Date.now();
					
					// Log.info("_________"+process.env.SERVER_ALIAS+"__________________");
					// Log.info("___________________________");
					// Log.info("___________________________");
					// Log.info("___________________________ target = ",target);
					// Log.info("_________"+process.env.SERVER_ALIAS+"__________________send serverCallObj:",serverCallObj);

					wsc.send(JSON.stringify(serverCallObj));

				} catch (error) {
					console.error('Error opening WebSocket:', error);
					wsc.close();
					reject(error);
				}
			});

			wsc.on('message', (message: string) => {
				try {

					// Log.info("___________"+process.env.SERVER_ALIAS+"________________onMessage() "+message);

					const serverResponseMessageObj: ServerResponseMessageObj = JSON.parse(message);
					serverResponseMessageObj.target = target;
					if ([SERVER_RESPONSE_TYPE.MESSAGE,SERVER_RESPONSE_TYPE.CLIENT_MESSAGE].includes(serverResponseMessageObj.responseType)) {

						// Log.info("_________"+process.env.SERVER_ALIAS+"__________________onMessage() IN ");

						serverResponseMessageObj.callTime = Date.now() - startTime;

						resolve(serverResponseMessageObj);
						wsc.close();
					}
					else
					{
						// Log.info("__________"+process.env.SERVER_ALIAS+"_________________onMessage() OUT ");
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

	public async SendToAllClients(wss:WebSocketServer, clientMessage: ServerResponseMessageObj)
	{
		// Log.info('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% SendToAllClients %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');

		return new Promise((resolve, reject) => {

			// Log.info(' SendToAllClients.Promise()');
			let idx:number = 0;
			wss.clients.forEach(client => {
				idx++;
				if (client.readyState === WebSocket.OPEN)
				{
					client.send(JSON.stringify(clientMessage));
				}
			});

			// Log.info(' RESOLVE.............'+idx);
			resolve({message:'sent to '+idx+' clients'});
		});
	}
}