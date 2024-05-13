import { SendPacketObj, SERVER_CALL_TYPE, SERVER_RESPONSE_TYPE, ServerCallMessageObj, ServerResponseMessageObj } from "@shared/DataTypes";
import Log from "../utils/Log";


export class SocketClient {
	private static instance: SocketClient;
	public static get(): SocketClient { if (!SocketClient.instance) { SocketClient.instance = new SocketClient(); } return SocketClient.instance; }
	constructor() {  };
	

	public Call(serverCallObj: ServerCallMessageObj): Promise<ServerResponseMessageObj> {
		return new Promise((resolve, reject) => {
			let sendPacketObj:SendPacketObj = serverCallObj.data as SendPacketObj;

			let target_ip = process.env[sendPacketObj.target+"_ip"];
			let target_port_external = process.env[sendPacketObj.target+"_port"];
			
			target_port_external = '7002';
			Log.info(' target_ip : '+target_ip);
			Log.info(' target_port_external : '+target_port_external);

			const WebSocket = require('ws');

			// URL of the WebSocket server to connect to
			const url = `ws://${target_ip}:${target_port_external}`;
			

			let startTime: number;

			const wsc = new WebSocket(url);
			
			wsc.on('open', function open() {

				let packetObj:ServerCallMessageObj = {
					callId:1,
					callType:SERVER_CALL_TYPE.PING,
					data:{}
				} as ServerCallMessageObj;

				startTime = Date.now();

				wsc.send(JSON.stringify(packetObj));
			});
			
			// Event listener for receiving messages from the server
			wsc.on('message', (message: MessageEvent) => {

				let serverResponseMessageObj:ServerResponseMessageObj = JSON.parse(message.toString());
				if(serverResponseMessageObj.responseType == SERVER_RESPONSE_TYPE.WELCOME)
				{

				}
				else if(serverResponseMessageObj.responseType == SERVER_RESPONSE_TYPE.MESSAGE)
				{
					serverResponseMessageObj.callTime = Date.now() - startTime;
					resolve(serverResponseMessageObj);
					wsc.close();
				}
			});
			
			// Handle errors
			wsc.on('error', (err: ErrorEvent) => {
				console.error('LOL WTF.......... WebSocket error:', err);
				reject(err);
				wsc.close();

			});
			
			// Handle connection closure
			wsc.on('close', function close() {
				console.log('LOL WTF.......... Disconnected from the server');
			});
		});
	}
}