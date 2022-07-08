import { Sequelize } from 'sequelize';

export class SingletonConnection {
	
    private static instance: SingletonConnection;
	private connection: Sequelize;

    private constructor() {

		if(process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST && process.env.DB_PORT) {
			var name:string = process.env.DB_NAME;
			var user:string = process.env.DB_USER;
			var password:string = process.env.DB_PASSWORD;
			var host:string = process.env.DB_HOST;
			var port:string = process.env.DB_PORT;
		  } else {
			throw new Error("Environment variable is not set")
		}

		this.connection = new Sequelize(name, user, password, {
			host: host,
			port: Number(port),
			dialect: 'mysql'
		});
	}

	public static getConnection(): Sequelize {
        if (!SingletonConnection.instance) {
            this.instance = new SingletonConnection();
        }
        return this.instance.connection;
    }
}