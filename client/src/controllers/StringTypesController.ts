import Networking from "utils/Networking";
import { NETWORK_ENDPOINT, NETWORK_ENDPOINTS} from "@shared/SharedNetworking";
import { AssocObj, StringTypeObj } from "@shared/DataTypes";

interface ENDPOINT_COLLECTION { [key: string]: StringTypeObj[]; }

export default class StringTypesController {

	static myInstance: StringTypesController;
	static get() { if (StringTypesController.myInstance == null) { StringTypesController.myInstance = new StringTypesController(); } return this.myInstance; }

	constructor(){}
	
	public StringTypes(endpoint:NETWORK_ENDPOINTS):StringTypeObj[]
	{
		return this._stringTypes[endpoint] || [];
	}
	private _stringTypes:ENDPOINT_COLLECTION = {};

	public async fetchAll(endpoint:NETWORK_ENDPOINT):Promise<StringTypeObj[]>
	{
		console.log("StringTypesController.loadStringTypes("+endpoint.endpoint+"->"+endpoint.fetchAll.toString()+")");
		return new Promise((resolve, reject) => {
			Networking.fetch<StringTypeObj[]>(endpoint.endpoint, endpoint.fetchAll.COMMAND, {}, (data, error) => {
				if (error){
					console.error('Error fetching stringTypes:', error);
					reject(error);
				} else {
					this._stringTypes[endpoint.endpoint] = data || [];
					resolve(this._stringTypes[endpoint.endpoint]);

					window.dispatchEvent(new CustomEvent(endpoint.fetchAll.toString(), { detail: this._stringTypes }));
				}
			});
		});
	}

	public GetStringTypeObjById(endpoint:NETWORK_ENDPOINT,id:number):StringTypeObj
	{
		if(this._stringTypes[endpoint.endpoint] == null || this._stringTypes[endpoint.endpoint].length == 0)
			return {id:-1,name:'error1'} as StringTypeObj;

		let returnObj:StringTypeObj = {id:-2,name:'error2'};

		this._stringTypes[endpoint.endpoint].forEach( (stringTypeObj:StringTypeObj) => {
			if(stringTypeObj.id === id)
			{
				returnObj = stringTypeObj;
			}
		});

		return returnObj
	}

	public async create(endpoint:NETWORK_ENDPOINT,stringTypeObj:StringTypeObj)
	{
		console.log("StringTypesController.createStringType("+endpoint.endpoint+"->"+endpoint.create.toString()+") ",stringTypeObj);
		return new Promise((resolve, reject) => {
			Networking.fetch<StringTypeObj[]>(endpoint.endpoint, endpoint.create.COMMAND, {stringObj:stringTypeObj}, (data, error) => {
				if (error){
					console.error('Error create stringType:', error);
					reject(error);
				} else {
					
					console.log("StringTypesController.createStringType("+endpoint+"->"+endpoint.create.toString()+") data:",data);
					resolve(data || []);

					window.dispatchEvent(new CustomEvent(endpoint.create.toString(), { detail: data }));
				}
			});
		});
	}

	public async update(endpoint:NETWORK_ENDPOINT,stringTypeObj:StringTypeObj)
	{
		console.log("StringTypesController.updateStringType("+endpoint.endpoint+"->"+endpoint.update.toString()+") ",stringTypeObj);
		return new Promise((resolve, reject) => {
			Networking.fetch<StringTypeObj[]>(endpoint.endpoint, endpoint.update.COMMAND, {stringObj:stringTypeObj}, (data, error) => {
				if (error){
					console.error('Error updating stringType:', error);
					reject(error);
				} else {
					
					console.log("StringTypesController.updateStringType("+endpoint+"->"+endpoint.update.toString()+") data:",data);
					resolve(data || []);

					window.dispatchEvent(new CustomEvent(endpoint.update.toString(), { detail: data }));
				}
			});
		});
	}

	public async delete(endpoint:NETWORK_ENDPOINT,stringTypeObj:StringTypeObj)
	{
		console.log("StringTypesController.deleteStringType("+endpoint.endpoint+"->"+endpoint.delete.toString()+") ",stringTypeObj);
		return new Promise((resolve, reject) => {
			Networking.fetch<StringTypeObj[]>(endpoint.endpoint, endpoint.delete.COMMAND, {stringObj:stringTypeObj}, (data, error) => {
				if (error){
					console.error('Error deleting stringType:', error);
					reject(error);
				} else {
					
					console.log("StringTypesController.deleteStringType("+endpoint+"->"+endpoint.delete.toString()+") data:",data);
					resolve(data || []);

					const event = new CustomEvent(endpoint.delete.toString(), { detail: data });
					window.dispatchEvent(event);
				}
			});
		});
	}

	public async createAssoc(endpoint:NETWORK_ENDPOINT,assocObj:AssocObj)
	{
		console.log("StringTypesController.createAssoc("+endpoint.endpoint+"->"+endpoint.createAssoc.toString()+") ASOCC=",assocObj);
		return new Promise((resolve, reject) => {
			Networking.fetch<StringTypeObj[]>(endpoint.endpoint, endpoint.createAssoc.COMMAND, {assocObj:assocObj}, (data, error) => {
				if (error){
					console.error('Error create createAssoc:', error);
					reject(error);
				} else {
					
					console.log("StringTypesController.createAssoc("+endpoint+"->"+endpoint.createAssoc.toString()+") data:",data);
					resolve(data || []);

					const event = new CustomEvent(endpoint.createAssoc.toString(), { detail: data });
					window.dispatchEvent(event);
				}
			});
		});
	}

	public async createAssocs(endpoint:NETWORK_ENDPOINT,assocObjs:AssocObj[])
	{
		console.log("StringTypesController.createAssocs("+endpoint.endpoint+"->"+endpoint.createAssoc.toString()+") ASOCC=",assocObjs);
		return new Promise((resolve, reject) => {
			Networking.fetch<StringTypeObj[]>(endpoint.endpoint, endpoint.createAssoc.COMMAND, {multi:true,assocObjs:assocObjs}, (data, error) => {
				if (error){
					console.error('Error create createAssocs:', error);
					reject(error);
				} else {
					
					console.log("StringTypesController.createAssocs("+endpoint+"->"+endpoint.createAssoc.toString()+") data:",data);
					resolve(data || []);

					const event = new CustomEvent(endpoint.createAssoc.toString(), { detail: data });
					window.dispatchEvent(event);
				}
			});
		});
	}

	public async deleteAssoc(endpoint:NETWORK_ENDPOINT,assocObj:AssocObj)
	{
		console.log("StringTypesController.deleteAssoc("+endpoint.endpoint+"->"+endpoint.deleteAssoc.toString()+") ASOCC=",assocObj);
		return new Promise((resolve, reject) => {
			Networking.fetch<StringTypeObj[]>(endpoint.endpoint, endpoint.deleteAssoc.COMMAND, {assocObj:assocObj}, (data, error) => {
				if (error){
					console.error('Error create deleteAssoc:', error);
					reject(error);
				} else {
					
					console.log("StringTypesController.deleteAssoc("+endpoint+"->"+endpoint.deleteAssoc.toString()+") data:",data);
					resolve(data || []);

					const event = new CustomEvent(endpoint.deleteAssoc.toString(), { detail: data });
					window.dispatchEvent(event);
				}
			});
		});
	}
}