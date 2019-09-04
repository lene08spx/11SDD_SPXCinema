import { 
	DenoHttp,
	SPXCinema 
} from "./deps.ts";

const WEB_PORT = 80;

const DATABASE = new SPXCinema.SPXData("./src/spxdata.json");

window.onload = async()=>
{
	const s = DenoHttp.serve(`0.0.0.0:${WEB_PORT}`);
	
	console.log(`-> SPXCinema@http://localhost:${WEB_PORT}/`);
	
	for await (const r of s)
	{
		SPXCinema.pathHandler(r, {
			"api": {
				"films": ()=>{
					SPXCinema.serveJSON(r,DATABASE.$["films"]);
				},
				"cinemas": ()=>{
					SPXCinema.serveJSON(r,DATABASE.$["cinemas"]);
				},
				"sessions": ()=>{
					SPXCinema.serveJSON(r,DATABASE.$["sessions"]);
				},
				"bookings": ()=>{
					SPXCinema.serveJSON(r,DATABASE.$["bookings"]);
				},
				[SPXCinema.DEFAULT_SYMBOL]: ()=>{
					SPXCinema.serveJSON(r,{});
				}
			},
			[SPXCinema.DEFAULT_SYMBOL]: ()=>{
				SPXCinema.servePage(r);
			}
		});
	}
	return;
}