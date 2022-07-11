import {Sequelize} from 'sequelize';

export class Singleton {

	private static instance: Singleton;
	private connection: Sequelize;

	private constructor () {
		if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST && process.env.DB_PORT) {
			var name: string = process.env.DB_NAME;
			var user: string = process.env.DB_USER;
			var password: string = process.env.DB_PASSWORD;
			var host: string = process.env.DB_HOST;
			var port: string = process.env.DB_PORT;
		}
		else {
			throw new Error("Environment variables are not set");
		}

		this.connection = new Sequelize(name, user, password, {
			host: host,
			port: Number(port),
			dialect: 'mysql'
		});
	}

	public static getConnection (): Sequelize {
		if (!Singleton.instance) {
			this.instance = new Singleton();
		}
		return this.instance.connection;
	}

}