import { SERVER_CALL_TYPE, SERVER_RESPONSE_TYPE, ServerCallMessageObj, ServerObj, ServerResponseMessageObj } from "@shared/DataTypes";
import { CUSTOM_EVENTS } from "dataTypes/ClientDataTypes";
import { ServerResponse } from "http";

export default class SocketController {

	static myInstance: SocketController;
	static get() { if (SocketController.myInstance == null) { SocketController.myInstance = new SocketController(); } return this.myInstance; }

	constructor() { }


	private _sockets: Map<string, WebSocket> = new Map<string, WebSocket>();

	public connect(serverObj: ServerObj): WebSocket {

		// console.log('SS connect to : ',serverObj.alias);

		let socket = this._sockets.get(serverObj.alias);
		if (!socket || socket.readyState === WebSocket.CLOSED) {

			// console.log('_______________SS not connected open please');
			// console.log(`ws://${serverObj.ip}:${serverObj.port_external}`);

			socket = new WebSocket(`ws://${serverObj.ip}:${serverObj.port_external}`);
			socket.onopen = () => {
				window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SOCKER_SERVER_OPEN,{detail:serverObj}));
			};

			socket.onerror = (error) => {
				window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SOCKER_SERVER_ERROR,{detail:serverObj}));
			}

			socket.onclose = () => {
				window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SOCKER_SERVER_CLOSED,{detail:serverObj}));
			} 

			this._sockets.set(serverObj.alias, socket);
		}
		return socket;
	}

	private _callId: number = 0;
	public get callId(): number {
		this._callId++;
		return this._callId;
	}

	public sendMessage(serverObj:ServerObj, serverCallObj:ServerCallMessageObj, callback: (data:any) => void): void {

		const socket = this.connect(serverObj);
		if (socket.readyState === WebSocket.OPEN)
		{
			socket.send(JSON.stringify(serverCallObj));

			socket.onmessage = (event) => {
				this.onMessage(event, serverObj, callback);
			};
		} else {
			socket.onopen = () => {

				socket.send(JSON.stringify(serverCallObj));

				socket.onmessage = (event) => {
					this.onMessage(event, serverObj, callback);
				};
			};
		}
	}

	private onMessage(event: MessageEvent, serverObj: ServerObj, callback:(data:any) => void) {

		let responseObj:ServerResponseMessageObj = JSON.parse(event.data);
		if(responseObj.responseType === SERVER_RESPONSE_TYPE.WELCOME)
		{
			window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SOCKER_SERVER_OPEN,{detail:serverObj}));
		}
		else if(responseObj.responseType === SERVER_RESPONSE_TYPE.MESSAGE)
		{
			callback(responseObj);
		}
	}
}

