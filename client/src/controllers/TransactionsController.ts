import { STRING_TYPES, TransactionObj, TransactionObjectModfier, TransactionsSet } from "@shared/DataTypes";
import { ENDPOINT_GROUPS, ENDPOINT_TAGS, NETWORK_COMMANDS, NETWORK_ENDPOINTS } from "@shared/SharedNetworking";
import Networking from "utils/Networking";
import StringTypesController from "./StringTypesController";
import MiscUtils from "@shared/MiscUtils";

export default class TransactionsController {

	static myInstance: TransactionsController;
	static get() { if (TransactionsController.myInstance == null) { TransactionsController.myInstance = new TransactionsController(); } return this.myInstance; }

	private _transactions:TransactionsSet = new TransactionsSet();
	public get Transactions():TransactionsSet { return this._transactions; }

	public async loadTransactions():Promise<TransactionObj[]>
	{
		return new Promise((resolve, reject) => {
			Networking.fetch<TransactionObj[]>(NETWORK_ENDPOINTS.TRANSACTIONS, NETWORK_COMMANDS.TRANSACTIONS_FETCH_ALL, {}, (data, error) => {
				if (error){
					console.error('Error fetching transactions:', error);
					reject(error);
				} else {
					this._transactions = new TransactionsSet();

					if(data != null)
					{
						data.forEach(transactionObj => {

							transactionObj.key = transactionObj.id.toString();

							transactionObj.dateObj = new Date(transactionObj.date);

							if(transactionObj.groups != null && transactionObj.groups.length > 0)
							{
								transactionObj.groups.forEach(groupObj => {
									groupObj.name  = StringTypesController.get().GetStringTypeObjById(ENDPOINT_GROUPS,groupObj.id).name;
								});
							}

							if(transactionObj.tags != null && transactionObj.tags.length > 0)
							{
								transactionObj.tags.forEach(tagObj => {
									tagObj.name  = StringTypesController.get().GetStringTypeObjById(ENDPOINT_TAGS,tagObj.id).name;
								});
							}
							
							this._transactions.dict[transactionObj.id] = transactionObj;
						});
					}

					resolve(this._transactions.arr);

					window.dispatchEvent(new CustomEvent(NETWORK_COMMANDS.TRANSACTIONS_FETCH_ALL.toString(), { detail: this._transactions }));
				}
			});
		});
	}

	public ModifyTransactionObject(id:number,delta: Partial<TransactionObjectModfier>):TransactionObj;
	public ModifyTransactionObject(transactionObj:TransactionObj,delta: Partial<TransactionObjectModfier>):TransactionObj;
	public ModifyTransactionObject(value: number | TransactionObj, delta: Partial<TransactionObjectModfier>): TransactionObj {
		let targetTransactionObj:TransactionObj;
		if (typeof value === "object" && 'id' in value) {
			targetTransactionObj = value as TransactionObj;
		}
		else {
			targetTransactionObj = this._transactions.dict[value as number];
		}

		let updatedTransactionObj: TransactionObj = { ...targetTransactionObj };

		if(delta.stringObjsToAdd)
		{
			delta.stringObjsToAdd.forEach(element => {

				let endpointInferedType:string = MiscUtils.GetPropertySafe(element as any,"endpoint");

				if(element.inferedType === STRING_TYPES.GROUPS || endpointInferedType === STRING_TYPES.GROUPS)
				{
					if(delta.groupsToAdd == null) delta.groupsToAdd = [];
					delta.groupsToAdd.push(element);
				}
				else if(element.inferedType === STRING_TYPES.TAGS  || endpointInferedType === STRING_TYPES.TAGS)
				{
					if(delta.tagsToAdd == null) delta.tagsToAdd = [];
					delta.tagsToAdd.push(element);
				}
			});
		}
		
		if(delta.stringObjsToRemove)
		{
			delta.stringObjsToRemove.forEach(element => {
				if(element.inferedType === STRING_TYPES.GROUPS)
				{
					if(delta.groupsToRemove == null) delta.groupsToRemove = [];
					delta.groupsToRemove.push(element);
				}
				else if(element.inferedType === STRING_TYPES.TAGS)
				{
					if(delta.tagsToRemove == null) delta.tagsToRemove = [];
					delta.tagsToRemove.push(element);
				}
			});
		}

		if(delta.groupsToAdd) {
			updatedTransactionObj.groups = updatedTransactionObj.groups ? 
				updatedTransactionObj.groups.concat(delta.groupsToAdd.filter(newGroup => !updatedTransactionObj.groups.some(group => group.id === newGroup.id))) :
				[...delta.groupsToAdd];
		}

		if (delta.groupsToRemove !== undefined) {
			const groupsToRemove = delta.groupsToRemove;
			updatedTransactionObj.groups = updatedTransactionObj.groups?.filter(group =>
				!groupsToRemove.some(g => g.id === group.id)
			) ?? [];
		}

		if(delta.tagsToAdd) {
			updatedTransactionObj.tags = updatedTransactionObj.tags ? 
				updatedTransactionObj.tags.concat(delta.tagsToAdd.filter(newTag => !updatedTransactionObj.tags.some(tag => tag.id === newTag.id))) :
				[...delta.tagsToAdd];
		}

		if (delta.tagsToRemove !== undefined) {
			const tagsToRemove = delta.tagsToRemove;
			updatedTransactionObj.tags = updatedTransactionObj.tags?.filter(tag =>
				!tagsToRemove.some(t => t.id === tag.id)
			) ?? [];
		}

		for (const key in delta) {
			if (delta.hasOwnProperty(key) && key !== STRING_TYPES.GROUPS && key !== STRING_TYPES.TAGS && key !== STRING_TYPES.GROUPS+'ToRemove' && key !== STRING_TYPES.TAGS+'ToRemove' && key !== STRING_TYPES.TAGS+'ToAdd' && key !== STRING_TYPES.TAGS+'ToAdd' && key !== 'stringObjsToAdd' && key !== 'stringObjsToRemove') {
				(updatedTransactionObj as any)[key] = (delta as any)[key];
			}
		}

		this._transactions.dict[updatedTransactionObj.id] = updatedTransactionObj;

		return updatedTransactionObj;
	}
}