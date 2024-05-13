export interface ServerObj {
	alias: string;
	ip: string;
	port_external: string;
	location?: string;
	latency?: string;
	port_internal?: string;
}

export enum SERVER_RESPONSE_TYPE {
	MESSAGE = 'messageResponse',
	CLIENT_MESSAGE = 'clientMessage',
	WELCOME = 'welcome',
	ERROR = 'error'
}

export enum SERVER_NODE_STATE {
	UNKNOWN = 'UNKNOWN',
	ERROR = 'ERROR',
	CONNECTED = 'CONNECTED',
	DISCONNECTED = 'DISCONNECTED',
}

export enum CLIENT_NODE_STATE {
	UNKNOWN = 'UNKNOWN',
	ERROR = 'ERROR',
	INITIALIZING = 'INITIALIZING',
	CONNECTING = 'CONNECTING',
	CONNECTED = 'CONNECTED',
	DISCONNECTED = 'DISCONNECTED',
}

export enum CLIENT_NODE_ACTION_STATE {
	NONE = 'NONE',
	COUNTDOWN = 'COUNTDOWN',
	LISTENING = 'LISTENING',
	SENDING = 'SENDING',
	RECEIVED = 'RECEIVED',
	RESULTS = 'RESULTS',
	RESET = 'RESET'
}

export interface ServerResponseMessageObj {
	callId: number;
	callTime: number;
	responseType: SERVER_RESPONSE_TYPE;
	message:string;
	clientState?: CLIENT_NODE_ACTION_STATE;
	clientData?:any;
	data?:any;
	target?:string;
	delta?:string;
}

export enum SERVER_CALL_TYPE {
	CONNECT = 'connect',
	PING = 'ping',
	SEND_PACKET = 'SEND_PACKET',
	START_PACKET_STREAM = 'SEND_PACKET_STREAM',
	END_PACKET_STREAM = 'END_PACKET_STREAM',
	DISCONNECT = 'disconnect',
	RESET = 'reset',
	RELAY_TO_ALL_CLIENTS = 'RELAY_TO_ALL_CLIENTS',
}

export interface ServerCallMessageObj {
	callId: number;
	callType: SERVER_CALL_TYPE;
	message?:string;
	data?:any;
	target?:string;
}

export interface SendPacketObj {
	target: string;
	numPackets: number;
}

export interface SendPacketResponseObj {
	response: string;
	callTime: number;
}

export interface SendPacketStreamObj {
	target: string;
	numPackets: number;
}


export interface MessageDictObj {
	callId:number,
	callBack:(data:any) => void;
}

export type MessagesDictionaryObj = { [key: number]:  MessageDictObj};
export class MessagesDictionary {

	private _messages:MessagesDictionaryObj = {};
	constructor(data:MessageDictObj[]=[]) {
		this._messages = {};
		if(data != null && data.length > 0)
		{
			data.forEach(transactionObj => {
				this._messages[transactionObj.callId] = transactionObj;
			});
		}
	}

	public get dict():MessagesDictionaryObj { return this._messages; }
	public get arr():MessageDictObj[]
	{
		return Object.values(this._messages);
	}
};