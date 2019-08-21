import { DenoHttp, DenoFs, DenoPath, DenoMediaTypes } from "./deps.ts";

const WEB_PORT = 80;
const WEB_ROOT = "./src/web";
const API_ROOT = "./src/api";


namespace SPXCinema
{
	class RequestHandler
	{
		
	}
	namespace API
	{
		interface I_PageAPI 
		{
			serve (r: DenoHttp.ServerRequest): void;
		};
		class Seats implements I_PageAPI
		{
			public serve( r: DenoHttp.ServerRequest )
			{
				
			}
		};
		class Sessions implements I_PageAPI
		{
			public serve( r: DenoHttp.ServerRequest )
			{

			}
		};
		class Cinemas implements I_PageAPI
		{
			public serve( r: DenoHttp.ServerRequest )
			{

			}
		};
	}
}

async function servePage( r: DenoHttp.ServerRequest, rootDir: string = WEB_ROOT, filename: string = "/index.html" ): Promise<void>
{
	let filePath: string;
	//console.log(r.url);
	if (r.url.endsWith("/"))
	{
		filePath = rootDir + filename;
	}
	else
	{
		filePath = rootDir + r.url;
	}

	//console.log(`URL> ${filePath}`);

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
	else
	{
		// Error 404
		//console.log(`!> 404::${r.url}`);
		if (DenoPath.extname(filePath) === "html")
		{
			r.respond({
				"body": new TextEncoder().encode("<!DOCTYPE html><h1>404</h1>"),
				"headers": new Headers([
					["Content-Type", "text/html"]
				]),
				"status": 404
			});
		}
		else r.respond({"status":404});
	}
}

window.onload = async()=>
{
	const s = DenoHttp.serve(`0.0.0.0:${WEB_PORT}`);
	console.log("-> Finished Compilation");
	console.log(`-> SPXCinema@http://localhost:${WEB_PORT}/`);
	for await (const r of s)
	{
		if (r.url.startsWith("/api"))
		{
			servePage(r,WEB_ROOT,"seat.html");
		}
		else
		{
			servePage(r);
		}
	}
	return;
}
console.log(/a/g.test("b"));