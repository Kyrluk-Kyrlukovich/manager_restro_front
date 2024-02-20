export default function truncateString(string: string, end: number) {
	if (string.length > end) return string.slice(0, end) + "...";
	return string;
}
