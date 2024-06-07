export function setUrl(url) {
	const publicUrl = /public/gi;
	const slicedUrl = url.replace(publicUrl, "storage");
	return `https://api.diplom-vasilev.ru/${slicedUrl}`;
}
