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

export interface ServerResponseMessageObj {
	callId: number;
	callTime: number;
	responseType: SERVER_RESPONSE_TYPE;
	message:string;
	data?:any;
}


export enum SERVER_CALL_TYPE {
	CONNECT = 'connect',
	PING = 'ping',
	SEND_PACKET = 'SEND_PACKET',
	START_PACKET_STREAM = 'SEND_PACKET_STREAM',
	END_PACKET_STREAM = 'END_PACKET_STREAM',
	DISCONNECT = 'disconnect'
}

export interface ServerCallMessageObj {
	callId: number;
	callType: SERVER_CALL_TYPE;
	message?:string;
	data?:any;
}

export interface SendPacketObj {
	target: string;
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
