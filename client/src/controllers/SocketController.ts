import { MessageDictObj, MessagesDictionary, SERVER_CALL_TYPE, SERVER_RESPONSE_TYPE, ServerCallMessageObj, ServerObj, ServerResponseMessageObj } from "@shared/DataTypes";
import { CUSTOM_EVENTS } from "dataTypes/ClientDataTypes";
import { ServerResponse } from "http";

export default class SocketController {

	static myInstance: SocketController;
	static get() { if (SocketController.myInstance == null) { SocketController.myInstance = new SocketController(); } return this.myInstance; }

	constructor() { }


	private _sockets: Map<string, WebSocket> = new Map<string, WebSocket>();
	private _messages:MessagesDictionary = new MessagesDictionary();

	public connect(serverObj: ServerObj): WebSocket {

		// console.log('SS connect to : ',serverObj.alias);

		let socket = this._sockets.get(serverObj.alias);
		if (!socket || socket.readyState === WebSocket.CLOSED) {

			// console.log('_______________SS not connected open please');
			// console.log(`ws://${serverObj.ip}:${serverObj.port_external}`);

			socket = new WebSocket(`ws://${serverObj.ip}:${serverObj.port_external}/ws/`);
			socket.onopen = () => {
				window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SOCKET_SERVER_OPEN,{detail:serverObj}));
			};

			socket.onerror = (error) => {
				window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SOCKET_SERVER_ERROR,{detail:serverObj}));
			}

			socket.onclose = () => {
				window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SOCKET_SERVER_CLOSED,{detail:serverObj}));
			}

			socket.onmessage = (event:MessageEvent) => {
				// console.log('');
				// console.log('____________________________________');
				// console.log('onMessage < OMG OMG OMG OMG OMG > : ',event);
				
				let responseObj:ServerResponseMessageObj = JSON.parse(event.data);
				if(responseObj.responseType === SERVER_RESPONSE_TYPE.WELCOME)
				{
					window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SOCKET_SERVER_OPEN,{detail:serverObj}));
				}
				else if(responseObj.responseType === SERVER_RESPONSE_TYPE.MESSAGE)
				{
					let messageDictObj:MessageDictObj = this._messages.dict[responseObj.callId];
					messageDictObj.callBack(responseObj);
				}
				else if(responseObj.responseType === SERVER_RESPONSE_TYPE.CLIENT_MESSAGE)
				{
					window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SOCKET_CLIENT_MESSAGE,{detail:responseObj}));
				}
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
			this._messages.dict[serverCallObj.callId] = {callId:serverCallObj.callId, callBack:callback};
			socket.send(JSON.stringify(serverCallObj));

		} else {
			socket.onopen = () => {


				this._messages.dict[serverCallObj.callId] = {callId:serverCallObj.callId, callBack:callback};
				socket.send(JSON.stringify(serverCallObj));

			};
		}
	}
}

