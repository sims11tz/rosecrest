import knex, { Knex } from "knex";

export default class Database {
	static myInstance: Database;
	static get() { if (Database.myInstance == null) { Database.myInstance = new Database(); } return this.myInstance; }

	private static db:Knex<any, unknown[]>;

	constructor() { Database.connect(); }

	private static async connect() {
		const knexConfig = require('../../knexfile');
		this.db = knex(knexConfig.development);
	}

	public static get knex(): Knex<any, unknown[]> {
		if(!this.db) {
			this.connect();
		}
		return this.db;
	}
}