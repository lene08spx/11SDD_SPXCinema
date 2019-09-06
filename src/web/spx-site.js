/// <reference lib="dom" />

const DAYS_ARRAY = [
	"Sundays",
	"Mondays",
	"Tuesdays",
	"Wednesdays",
	"Thursdays",
	"Fridays",
	"Saturdays"
];

const MONTHS_ARRAY = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

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
	return String(h%12||12) + ":" + m + (h<12?" AM":" PM");
}

function spxDuration( timeString="0000" )
{
	let h = Number(timeString.slice(0,2));
	let m = Number(timeString.slice(2,4));
	// Hours + Spacing + Minutes
	return (h?String(h)+"hr":'') + ((h&&m)?' ':'') + (m?String(m)+"min":'');
}

function spxToday()
{
	let d = new Date();
	return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function spxNextDate( today="2019-1-1", days="Mondays" )
{
	let out = new Date();
	out = spxWeek(today)[days];
	return out;
}

function spxWeek( today="2019-09-05" )
{
	let tSplit = today.split("-").map(Number);

	let todayDate = new Date();
	todayDate.setUTCHours(0,0,0,0);
	todayDate.setUTCFullYear(tSplit[0],tSplit[1]-1,tSplit[2]);
	let dates = [
		todayDate,
		new Date(),
		new Date(),
		new Date(),
		new Date(),
		new Date(),
		new Date()
	];
	for(let i=1;i<7;i++){
		dates[i].setUTCHours(0,0,0,0);
		dates[i].setUTCFullYear(tSplit[0],tSplit[1]-1,tSplit[2]);
		dates[i].setUTCDate(todayDate.getUTCDate()+i);
	}
	let daysOfWeek = {
		"Mondays": null,
		"Tuesdays": null,
		"Wednesdays": null,
		"Thursdays": null,
		"Fridays": null,
		"Saturdays": null,
		"Sundays": null
	};
	for (let d of dates){daysOfWeek[DAYS_ARRAY[d.getUTCDay()]]=d;}
	return daysOfWeek;
}

function spxFormatDate(d=Date.prototype)
{
	return `${DAYS_ARRAY[d.getUTCDay()].substr(0,3)} ${d.getUTCDate()} ${MONTHS_ARRAY[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}