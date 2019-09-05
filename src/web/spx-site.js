/// <reference lib="dom" />

async function api( uri="", jsonBody=undefined )
{
	let r = Response.prototype;

	if (jsonBody === undefined)
		r = await fetch("/api/"+uri);
	else
		r = await fetch("/api/"+uri,{
			"body": JSON.stringify(jsonBody),
			"method": "POST"
		});
	if (r.status !== 200)
	{
		throw "API Error";
	}
	return await r.json();
}

function queryString()
{
	return "?"+document.URL.split("?")[1] || "";
}

function spxTime( timeString="0000" )
{
	let h = Number(timeString.slice(0,2));
	let m = timeString.slice(2,4);
	return String(h%12||12) + ":" + m + (h<=12?" AM":" PM");
}
