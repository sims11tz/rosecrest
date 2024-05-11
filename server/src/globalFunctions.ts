export function convertDateToISO(dateStr: string): string {
	// Split the date by '/'
	const parts = dateStr.split('/');
	if (parts.length === 3) {
		const [month, day, year] = parts;
		// Reassemble the date in 'YYYY-MM-DD' format
		return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
	} else {
		throw new Error("Invalid date format");
	}
}