export interface MemberObj {
	id:number;
	firstName:string;
	lastName:string;
}

export interface AccountObj {
	id:number;
	account:string;
}

export interface CategoryObj {
	id:number;
	category:string;
}

export enum STRING_TYPES {
	GROUPS = "groups",
	TAGS = "tags"
}

export interface StringTypeObj {
	id:number;
	name:string;
	inferedType?:string;
	createdBy?:number;
	createdTs?:Date;
	editedBy?:number;
	editedTs?:Date;
}
export interface GroupObj extends StringTypeObj { }
export interface TagObj extends StringTypeObj { }

export interface AssocObj {
	id:number;
	name:string;
	assocType:string;
	assocId:number;
	transactionId:number;
	createdBy?:number;
	createdTs?:Date;
	editedBy?:number;
	editedTs?:Date;
}

export interface TransactionObj {
	id:number;
	key:string;
	date:string;
	dateObj?:Date;
	niceDate?:string;
	shortDescription:string;
	description:string;
	member:string;
	accountNumber:number;
	amount:number;
	details:string;
	appearAs:string;
	address:string;
	city:string;
	state:string;
	zip:string;
	reference:string;
	category:string;
	categoryString:string;
	country:string;
	groupId:number;
	groups:GroupObj[];
	tagId:number;
	tags:TagObj[];
}

export type TransactionDictionary = { [key: string]:  TransactionObj};
export class TransactionsSet {

	private _transactions:TransactionDictionary = {};
	constructor(data:TransactionObj[]=[]) {
		this._transactions = {};
		if(data != null && data.length > 0)
		{
			data.forEach(transactionObj => {
				this._transactions[transactionObj.id] = transactionObj;
			});
		}
	}

	public get dict():TransactionDictionary { return this._transactions; }
	public get arr():TransactionObj[]
	{//TODO cache the map of the dictionary....
		return Object.values(this._transactions);
	}
};

export type TransactionObjectModfier = {
	stringObjsToAdd?: StringTypeObj[],
	stringObjsToRemove?: StringTypeObj[],
	groupsToAdd?: GroupObj[],
	groupsToRemove?: GroupObj[],
	tagsToAdd?: TagObj[],
	tagsToRemove?: TagObj[],
	[key: string]: any
}