import { 
	DenoHttp,
	SPXCinema 
} from "./deps.ts";

const WEB_PORT = 80;

const DATABASE = new SPXCinema.SPXData("./src/spxdata.json");

window.onload = async()=>
{
	const s = DenoHttp.serve(`0.0.0.0:${WEB_PORT}`);
	//console.log("-> Finished Compilation");
	console.log(`-> SPXCinema@http://localhost:${WEB_PORT}/`);
	for await (const r of s)
	{
		SPXCinema.pathHandler(r, {
			"api": {
				"films": ()=>{
					SPXCinema.serveAPI(r,DATABASE.$["films"]);
				},
				"cinemas": ()=>{
					SPXCinema.serveAPI(r,DATABASE.$["cinemas"]);
				},
				"sessions": ()=>{
					SPXCinema.serveAPI(r,DATABASE.$["sessions"]);
				},
				"bookings": ()=>{
					SPXCinema.serveAPI(r,DATABASE.$["bookings"]);
				},
				[SPXCinema.defaultSymbol]: ()=>{
					SPXCinema.serveAPI(r,{});
				}
			},
			[SPXCinema.defaultSymbol]: ()=>{
				SPXCinema.servePage(r);
			}
		});
	}
	return;
}