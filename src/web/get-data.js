/// <reference lib="dom" />
let x = new XMLHttpRequest();

x.onreadystatechange = function( e )
{
	if (this.readyState == 4 && this.status == 200)
	{
		JSON.parse(this.responseText);
	}
}

async function api( uri="" )
{
	const r = await fetch("/api/web.json");
	if (r.status !== 200)
	{
		throw "API Error";
	}
	return await r.json();
}