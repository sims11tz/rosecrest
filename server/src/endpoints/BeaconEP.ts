import Log from "../utils/Log";
import { BaseEP } from "./_baseEP";
import { NETWORK_SUCCESS_PAYLOAD } from "@shared/SharedNetworking";

export class BeaconEP extends BaseEP {
	private static instance: BeaconEP;
	public static get(): BeaconEP { if (!BeaconEP.instance) { BeaconEP.instance = new BeaconEP(); } return BeaconEP.instance; }
	constructor() { super(); };

	public async fetchAll()
	{
		let returnObj = {};

		// let accounts:AccountObj[] = await Database.knex('accounts').select('*');
		// if (accounts)
		// {
		// 	returnObj = Object.values(JSON.parse(JSON.stringify(accounts)));
		// }

		return new NETWORK_SUCCESS_PAYLOAD(returnObj);
	}
} 