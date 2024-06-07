export function setUrl(url) {
	const publicUrl = /public/gi;
	const slicedUrl = url.replace(publicUrl, "storage");
	return `http://localhost:80/${slicedUrl}`;
}
