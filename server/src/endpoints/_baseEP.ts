import MiscUtils from "@shared/MiscUtils";
import { NETWORK_COMMANDS, NETWORK_ERROR_PAYLOAD, NETWORK_PAYLOAD, NETWORK_STATUS_CODES } from "@shared/SharedNetworking";

export class BaseEP {
	[key: string]: any;

	public async route(command:NETWORK_COMMANDS,body:any):Promise<NETWORK_PAYLOAD>
	{
		let methodFunction:string = command.substring(command.indexOf('_') + 1);
		if(body.hasOwnProperty('multi') && MiscUtils.GetPropertySafe(body,'multi') == true)
		{
			methodFunction += 's';
		}

		let proto = Object.getPrototypeOf(this);

		while (proto !== null) {
			const properties = Object.getOwnPropertyNames(proto)
				.filter(prop => typeof this[prop] === 'function' && prop !== 'constructor');
	
			for (const method of properties) {
				if (methodFunction === method) {
					const methodRef = this[method];
					if (typeof methodRef === 'function') {
						return await methodRef.call(this, body);
					}
				}
			}
			proto = Object.getPrototypeOf(proto);
		}

		return  {code:NETWORK_STATUS_CODES._404_NOT_FOUND,message:"Endpoint routing error : "+command} as NETWORK_ERROR_PAYLOAD;
	}
}