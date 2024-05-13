import { SendPacketObj, SERVER_CALL_TYPE, SERVER_RESPONSE_TYPE, ServerCallMessageObj, ServerResponseMessageObj } from "@shared/DataTypes";
import WebSocket from 'ws';
import Log from "../utils/Log";

export class SocketClient {
	private static instance: SocketClient;
	public static get(): SocketClient { if (!SocketClient.instance) { SocketClient.instance = new SocketClient(); } return SocketClient.instance; }
	constructor() {};
	
	public Call(serverCallObj: ServerCallMessageObj): Promise<ServerResponseMessageObj[]>
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
					let packetObj: ServerCallMessageObj = {
						callId: 1,
						callType: SERVER_CALL_TYPE.PING,
						data: {}
					};
					startTime = Date.now();
					wsc.send(JSON.stringify(packetObj));

				} catch (error) {
					console.error('Error opening WebSocket:', error);
					wsc.close();
					reject(error);
				}
			});

			wsc.on('message', (message: string) => {
				try {
					const serverResponseMessageObj: ServerResponseMessageObj = JSON.parse(message);
					if ([SERVER_RESPONSE_TYPE.MESSAGE].includes(serverResponseMessageObj.responseType)) {

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
				console.log('Disconnected from the server');
			});
		});
	}
}