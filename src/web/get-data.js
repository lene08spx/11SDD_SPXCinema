/// <reference lib="dom" />
let x = new XMLHttpRequest();

x.onreadystatechange = function()
{
	if (this.readyState == 4 && this.status == 200)
	{
		let res = JSON.parse(this.responseText);
		console.log(res);
	}
}

async function api( uri="" )
{
	const r = await fetch("/api/"+uri);
	if (r.status !== 200)
	{
		throw "API Error";
	}
	return await r.json();
}