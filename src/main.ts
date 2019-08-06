import { DenoHttp, DenoFs, DenoPath, DenoMediaTypes } from "./deps.ts";

const WEB_PORT = 80;
const WEB_ROOT = "./src/web"

async function servePage( r: DenoHttp.ServerRequest, filename?: string ): Promise<void>
{
	let filePath = WEB_ROOT + (filename || r.url);
	//console.log(filePath);
	if (await DenoFs.exists( filePath ))
	{
		// Serve Page
		console.log(`?> ${filePath}`);
		r.respond({
			"body": await Deno.readFile( filePath ),
			"headers": new Headers([
				["Content-Type",DenoMediaTypes.lookup(filePath)||"text/plain"]
			]),
			"status": 200
		});
	}
	else
	{
		// Error 404
		console.log(`!> 404::${r.url}`);
		r.respond({
			"body": new TextEncoder().encode("<!DOCTYPE html><h1>404</h1>"),
			"headers": new Headers([
				["Content-Type","text/plain"]
			]),
			"status": 404
		});
	}
}
window.onload = async()=>
{
	const s = DenoHttp.serve(`0.0.0.0:${WEB_PORT}`);
	console.log("-> Finished Compilation");
	console.log(`-> SPXCinema@http://localhost:${WEB_PORT}/`);
	for await (const r of s) {
		switch (r.url) {
			case "/":
				servePage( r, "/index.html" );
				break;
			default:
				servePage( r );
				break;
		}
	}
	return;
}
