export enum NETWORK_STATUS_CODES {
	_0_UNPROCESSED = 0,
	_200_OK = 200,
	_400_BAD_REQUEST = 400,
	_401_UNAUTHORIZED = 401,
	_403_FORBIDDEN = 403,
	_404_NOT_FOUND = 404,
	_409_CONFLICT = 409,
	_500_INTERNAL_SERVER_ERROR = 500,
	_503_SERVICE_UNAVAILABLE = 503,
}

export enum NETWORK_PAYLOAD_TYPES {
	NONE = "none",
	ERROR = "error",
	SUCCESS = "success"
}

export interface NETWORK_PAYLOAD {
	type:NETWORK_PAYLOAD_TYPES;
	code:NETWORK_STATUS_CODES;
	data:object;
}

export class NETWORK_PAYLOAD_NONE implements NETWORK_PAYLOAD {
	public get type():NETWORK_PAYLOAD_TYPES
	{
		return NETWORK_PAYLOAD_TYPES.NONE;
	}

	public get code():NETWORK_STATUS_CODES
	{
		return NETWORK_STATUS_CODES._0_UNPROCESSED;
	}

	public get data():object
	{
		return {};
	}
}

export class NETWORK_SUCCESS_PAYLOAD implements NETWORK_PAYLOAD {

	public data:object;

	constructor(data:object)
	{
		this.data = data;
	}

	public get type():NETWORK_PAYLOAD_TYPES
	{
		return NETWORK_PAYLOAD_TYPES.SUCCESS;
	}

	public get code():NETWORK_STATUS_CODES
	{
		return NETWORK_STATUS_CODES._200_OK;
	}
}

export class NETWORK_ERROR_PAYLOAD implements NETWORK_PAYLOAD {

	public code:NETWORK_STATUS_CODES;
	public message:string;

	constructor(code:NETWORK_STATUS_CODES,message:string)
	{
		this.code = code;
		this.message = message;
	}

	public get type():NETWORK_PAYLOAD_TYPES
	{
		return NETWORK_PAYLOAD_TYPES.ERROR;
	}

	public get data():object
	{
		return {error:true,code:this.code,message:this.message};
	}
}

export class NETWORK_COMMAND {
	public command:NETWORK_COMMANDS
	constructor(command: NETWORK_COMMANDS) {
		this.command = command;
	}

	public toString():string {
		return this.command.toString();
	}

	public get COMMAND():NETWORK_COMMANDS {
		return this.command;
	}
};

export class NETWORK_ENDPOINT {
	public endpoint:NETWORK_ENDPOINTS;
	public hello:NETWORK_COMMAND;

	constructor(endpoint: NETWORK_ENDPOINTS, hello:NETWORK_COMMAND)
	{
		this.endpoint = endpoint;
		this.hello = hello;
	}

	public get name():string {
		return this.endpoint.substring(0,this.endpoint.length-1);
	}

	public get namePlural():string {
		return this.endpoint.toString();
	}
};

export enum NETWORK_ENDPOINTS {
	BEACON="beacon",
};

export function NETWORK_ENDPOINT_BY_NAME(endpoint:string): NETWORK_ENDPOINT{
	
	switch(endpoint)
	{
		case NETWORK_ENDPOINTS.BEACON: return ENDPOINT_BEACON;
		default: throw new Error("NETWORK_ENDPOINT_BY_NAME("+endpoint+") not found");
	}
}

export enum NETWORK_COMMANDS {
	UNDEFINED = "undefined",
	BEACON_HELLO = "becaon_hello",
};

export const ENDPOINT_BEACON:NETWORK_ENDPOINT = new NETWORK_ENDPOINT(NETWORK_ENDPOINTS.BEACON,
	new NETWORK_COMMAND(NETWORK_COMMANDS.BEACON_HELLO)
);
