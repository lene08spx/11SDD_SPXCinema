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

type PathTree = {[key: string]: ((()=>any) | PathTree)}

async function getPath( r: DenoHttp.ServerRequest, filename: string ): Promise<string | null>
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
		if (!filename.startsWith("/"))
			filename = "/" + filename;
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

async function servePage( r: DenoHttp.ServerRequest, filename: string = "", rootDir: string = WEB_ROOT ): Promise<void>
{
	let defaultFile = "index.html";
	let filePath: string;
	if (filename === "")
	{
		if (r.url.endsWith("/")) filePath = rootDir + r.url + defaultFile;
		else filePath = rootDir + r.url;
	}
	else
	{
		if (!filename.startsWith("/")) filename = "/" + filename;
		filePath = rootDir + filename;
	}

	//console.log(`URL> ${filePath}`);

	// Does the file exist
	if (await DenoFs.exists( filePath ))
	{
		// Serve Page
		r.respond({
			"body": await Deno.readFile( filePath ),
			"headers": new Headers([
				["Content-Type", DenoMediaTypes.lookup(filePath)||"text/plain"]
			]),
			"status": 200
		});
	}
	// Error 404
	// File not found
	else
	{
		// Return a text representation.
		if (DenoPath.extname(filePath) === ".html")
		{
			r.respond({
				"body": new TextEncoder().encode("<!DOCTYPE html><h1>404</h1>"),
				"headers": new Headers([
					["Content-Type", "text/html"]
				]),
				"status": 404
			});
		}
		// Return just an error code.
		else r.respond({"status":404});
	}
}

function pathHandler(request: DenoHttp.ServerRequest, tree: PathTree)
{
	let url = request.url.split("?")[0].replace(/(^\/|\/$)/gm,"").split("/");
	//console.log(url);
	let temp: any = tree;
	for (let i = 0; i < url.length; i++)
	{
		if (temp instanceof Function) break;
		temp = temp[url[i]] || temp[defaultSymbol];
	}
	if (!(temp instanceof Function)) temp = temp[defaultSymbol];
	if (temp instanceof Function) temp();
	else throw "Declaration is not a function.";
}

interface I_SPXData
{
	cinemas: {
		"cinemaId":	number,
		"name":		string
	}[];
	films: {
		"filmId":	number,
		"name":		string,
		"time":		string,
		"trailer":	string,
		"director":	string,
		"bio":		string
	}[];
	sessions: {
		"sessionId":number,
		"name":		string,
		"filmId":	string,
	}[];
	bookings: {
		"bookingId":number,
		"sessionId":number,
		"seats":	string[],
		"name":		string,
		"phone":	string,
		"email":	string,
		"code":		string,
		"date":		string
	}[];
};

class SPXData
{
	public $: I_SPXData;
	constructor( private filename: string )
	{
		this.$ = <I_SPXData>DenoFs.readJsonSync(filename);
	}
	public write()
	{
		DenoFs.writeJsonSync(this.filename, this.$);
	}
};

export {
	WEB_ROOT,
	API_ROOT,
	serveJSON,
	servePage,
	pathHandler,
	DEFAULT_SYMBOL,
	I_SPXData,
	SPXData
};
