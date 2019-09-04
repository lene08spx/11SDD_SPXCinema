/// <reference lib="dom" />

async function api( uri="" )
{
	const r = await fetch("/api/"+uri);
	if (r.status !== 200)
	{
		throw "API Error";
	}
	return await r.json();
}