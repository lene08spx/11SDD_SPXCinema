import {
	enc,
	dec,
	DenoFs,
	DenoHttp,
	DenoPath, 
	DenoMediaTypes, 
} from "./deps.ts";

const WEB_ROOT = "./src/web";
const API_ROOT = "./src/api";
const DEFAULT_SYMBOL = Symbol("default");
const DEFAULT_FILENAME = "index.html";

async function getPath( r: DenoHttp.ServerRequest, filename?: string ): Promise<string | null>
{
	let filePath: string = "";

	// No file specified, use what the Request URL asks for e.g. "http://localhost/main.css".
	if (filename === undefined)
	{
		if (r.url.endsWith("/"))
			filePath = WEB_ROOT + r.url + DEFAULT_FILENAME;
		else
			filePath = WEB_ROOT + r.url;
	}
	// If we want to serve a specific file
	else
	{
		if (filename.startsWith("/"))
			filename = "." + filename;
		filePath = filename;
	}

	if (await DenoFs.exists(filePath))
		return filePath;
	else
		return null;
}

async function serveJSON( r: DenoHttp.ServerRequest, object: any )
{
	r.respond({
		"body": enc(JSON.stringify(object)),
		"headers": new Headers([
			["Content-Type", "application/json"]
		]),
		"status": 200
	});
}

async function servePage( r: DenoHttp.ServerRequest, filename?: string ): Promise<void>
{
	let filePath = await getPath(r, filename);
	if (filePath)
	{
		r.respond({
			"body": await Deno.open( filePath ),
			"headers": new Headers([
				["Content-Type", DenoMediaTypes.lookup(filePath)||"text/plain"]
			]),
			"status": 200
		});
	}
	else
	{
		r.respond({"status":404});
	}
}

async function serveDynamic( r: DenoHttp.ServerRequest, filename: string ): Promise<void>
{
	let filePath = await getPath(r, filename);
	let queryString = new URL(r.url,"/").search;
	if (filePath)
	{
		let body = await DenoFs.readFileStr("./src/dynamic/_start.html");
		body += await DenoFs.readFileStr(filePath);
		body += await DenoFs.readFileStr("./src/dynamic/_end.html");
		r.respond({
			"body": enc(body),
			"headers": new Headers([
				["Content-Type", "text/html"]
			]),
			"status": 200
		});
	}
	else
	{
		r.respond({"status":404});
	}
}

// an object that represents a website directory tree structure
// everything is an object, a page is a void function
type PathTree = {[key: string]: ((()=>any) | PathTree)}

function requestPathHandler(request: DenoHttp.ServerRequest, tree: PathTree)
{
	// split url into a list of its paths e.g. /main/index.html -> ["main", "index.html"]
	let url = request.url.split("?")[0].replace(/(^\/|\/$)/gm,"").split("/");
	//console.log("$$",url)
	let temp: any = tree;
	// filter through provided tree and determine if it is an "end point" or a page or a directory
	// if the page cannot be found, go to the default_symbol's function
	for (let i = 0; i < url.length; i++)
	{
		if (temp instanceof Function) break;
		temp = temp[url[i]] || temp[DEFAULT_SYMBOL];
	}
	// "/api/" will leave the last temp as an object, choose the default symbol and run that function
	if (!(temp instanceof Function)) temp = temp[DEFAULT_SYMBOL];
	// run the function to handle that page
	if (temp instanceof Function) temp();
	// welp, i guess i stuffed up if this throws.
	// means that there is no default function for a branch in the tree
	else throw "Declaration is not a function.";
}

interface I_SPXData
{
	bookingIdTracker:		number,
	cinemas: {
		"cinemaId":			number,
		"cinemaName":		string
	}[];
	films: {
		"filmId":			number,
		"filmName":			string,
		"filmDuration":		string,
		"filmTrailer":		string,
		"filmDirector":		string,
		"filmDescription":	string
	}[];
	sessions: {
		"sessionId":		number,
		"filmId":			number,
		"cinemaId": 		number,
		"sessionTime":		string
	}[];
	bookings: {
		"bookingId":		number,
		"sessionId":		number,
		"bookingSeats":		string[],
		"bookingName":		string,
		"bookingPhone":		string,
		"bookingEmail":		string,
		"bookingCode":		string,
		"bookingDate":		string
	}[];
};

class SPXData
{
	$: I_SPXData;
	constructor( private filename: string )
	{
		this.$ = <I_SPXData>DenoFs.readJsonSync(filename);
	}
	async write()
	{
		await DenoFs.writeJson(this.filename, this.$, {
			spaces: 2
		});
	}
};

export {
	WEB_ROOT,
	API_ROOT,
	serveJSON,
	servePage,
	requestPathHandler,
	DEFAULT_SYMBOL,
	I_SPXData,
	SPXData,
	serveDynamic
};
