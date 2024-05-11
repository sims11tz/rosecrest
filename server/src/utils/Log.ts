import winston from "winston";
import util from 'util';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const level = () => {
	const env = process.env.NODE_ENV || "development";
	const isDevelopment = env === "development";
	return isDevelopment ? "debug" : "warn";
};

const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "magenta",
	debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine( 
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
	winston.format.colorize({ all: true }),
	winston.format.printf((info) => {
		// Construct message initially as the base message
		let message = `${info.timestamp} ${info.level}: ${info.message}`;
		
		// If there are additional splat arguments, handle them
		if (info[Symbol.for('splat')]) {
			// Map through each splat item and convert to string if object
			const splat = info[Symbol.for('splat')].map((arg:any) => {
				if (typeof arg === 'object') {
					return util.inspect(arg, { showHidden: false, depth: null, colors: true });
				}
				return arg;
			}).join(' ');
			message += ` ${splat}`;
		}

		return message;
	})
);

const transports = [
	new winston.transports.Console(),
	new winston.transports.File({
		filename: "logs/error.log",
		level: "error",
	}),
	new winston.transports.File({ filename: "logs/all.log" }),
];

const Log = winston.createLogger({
	level: level(),
	levels,
	format,
	transports,
});

export default Log;
