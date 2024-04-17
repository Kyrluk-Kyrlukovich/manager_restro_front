export function setUrl(url) {
	const publicUrl = /public/gi;
	const slicedUrl = url.replace(publicUrl, "storage");
	return `http://94.26.255.206:81/${slicedUrl}`;
}
