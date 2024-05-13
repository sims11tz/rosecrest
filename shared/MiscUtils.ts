export default class MiscUtils {
	static myInstance: MiscUtils;
	static get() { if (MiscUtils.myInstance == null) { MiscUtils.myInstance = new MiscUtils(); } return this.myInstance; }

	public static CapitalizeFirstLetter(string:string):string {
		if (!string) return string;
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	public static RemoveLastS(str:string):string {
		if (str.endsWith('s')) {
			return str.slice(0, -1);
		}
		return str;
	}

	public static FormatDate(date: Date):string{
		if (!date) return "";
		const d = new Date(date);
		const month = `${d.getMonth() + 1}`.padStart(2, '0');
		const day = `${d.getDate()}`.padStart(2, '0');
		const year = d.getFullYear();
		return [month, day, year].join('-');
	}

	public static AddCommas(x:any):string {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	public static HasKey<T extends object>(obj: T, key: keyof any): key is keyof T {
		return key in obj;
	}

	public static GetPropertySafe<T extends object, K extends keyof T>(obj: T, key: K): T[K] | undefined {
		if (MiscUtils.HasKey(obj, key)) {
			return obj[key];
		}
		return undefined;
	}

	public static GetNestedPropertySafe<T extends object>(obj: T, path: (keyof any)[]): any {
		let result: any = obj;
		for (const key of path) {
			if (result === undefined || result === null || !(key in result)) {
				return undefined;
			}
			result = result[key];
		}
		return result;
	}

	public static GetISODay(date: Date): number {
		const day = date.getDay();
		return day === 0 ? 7 : day;  // Convert Sunday from 0 to 7; Monday (1) to Saturday (6) are fine as is
	}

	public static GetISOWeek(date: Date): number {
		const dayNum = date.getDay() || 7; // Ensure Sunday is considered the last day
		date.setDate(date.getDate() + 4 - dayNum);
		const yearStart = new Date(date.getFullYear(), 0, 1);
		return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
	}
	
	public static GetISOYear(date: Date): number {
		const dayNum = date.getDay() || 7; // Ensure Sunday is considered the last day
		date.setDate(date.getDate() + 4 - dayNum);
		return date.getFullYear();
	}

	public static FormatMilliseconds(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const milliseconds = ms % 1000;
		return `${seconds}s ${milliseconds}ms`;
	}

	public static GhettoWait(ms:number) { 
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}