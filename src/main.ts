import { 
	DenoHttp,
	SPXCinema,
	dec,
	DenoFs
} from "./deps.ts";

const WEB_PORT = 80;

const DATABASE = new SPXCinema.SPXData("./src/spxdata.json");

window.onload = async()=>
{
	const s = DenoHttp.serve(`0.0.0.0:${WEB_PORT}`);

	console.log(`-> Deno v${Deno.version.deno}`);
	
	console.log(`-> SPXCinema @ http://localhost:${WEB_PORT}/home`);
	
	for await (const r of s)
	{
		let urlParams = new URL(r.url,"/").searchParams;
		SPXCinema.requestPathHandler(r, {
			"api": {
				"films": ()=>{
					// retrieve the list of films
					if (urlParams.get("filmId"))
					{
						SPXCinema.serveJSON(r,DATABASE.$["films"].filter(
							function(v){return v["filmId"] === Number(urlParams.get("filmId"))}
						)[0]);
					}
					else
					{
						SPXCinema.serveJSON(r,DATABASE.$["films"]);
					}
				},
				"cinemas": ()=>{
					// retrieve the list of cinemas
					if (urlParams.get("cinemaId"))
					{
						SPXCinema.serveJSON(r,DATABASE.$["cinemas"].filter(
							function(v){return v["cinemaId"] === Number(urlParams.get("cinemaId"))}
						)[0]);
					}
					else
					{
						SPXCinema.serveJSON(r,DATABASE.$["cinemas"]);
					}
				},
				"sessions": ()=>{
					// retrieve the list of sessions that fulfill the criteria
					if (urlParams.get("cinemaId"))
					{
						SPXCinema.serveJSON(r,DATABASE.$["sessions"].filter(
							function(v){return v["cinemaId"] === Number(urlParams.get("cinemaId"))}
						));
					}
					else if (urlParams.get("filmId"))
					{
						SPXCinema.serveJSON(r,DATABASE.$["sessions"].filter(
							function(v){return v["filmId"] === Number(urlParams.get("filmId"))}
						));
					}
					else if (urlParams.get("sessionId"))
					{
						SPXCinema.serveJSON(r,DATABASE.$["sessions"].filter(
							function(v){return v["sessionId"] === Number(urlParams.get("sessionId"))}
						)[0]);
					}
					else
					{
						SPXCinema.serveJSON(r,DATABASE.$["sessions"]);
					}
				},
				"bookings": ()=>{
					// retrieve the list of bookings for a given session
					if (urlParams.get("sessionId"))
					{
						SPXCinema.serveJSON(r,DATABASE.$["bookings"].filter(
							function(v){return v["sessionId"] === Number(urlParams.get("sessionId"))}
						));
					}
					else if (urlParams.get("bookingCode"))
					{
						SPXCinema.serveJSON(r,DATABASE.$["bookings"].filter(
							function(v){return v["bookingCode"] === urlParams.get("bookingCode")||""}
						)[0]);
					}
					else
					{
						SPXCinema.serveJSON(r,DATABASE.$["bookings"]);
					}
				},
				"reserve": ()=>{
					// reserve a seat given the provided information
					// increment bookingIdTracker number
					++DATABASE.$["bookingIdTracker"];
					// generate booking code
					let bookCode = Array.from(crypto.getRandomValues(new Uint8Array(2)),v=>v.toString(16).padStart(2,"0")).join("");
					bookCode = bookCode + (DATABASE.$["bookingIdTracker"].toString(32).padStart(4,"0"));
					// process incoming booking
					r.body().then(v=>{
						let d = new Date();
						let data = <SPXCinema.I_SPXData["bookings"][0]>JSON.parse(dec(v)||"");
						data["bookingId"] = DATABASE.$["bookingIdTracker"];
						data["bookingDate"] = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
						data["bookingCode"] = bookCode;
						DATABASE.$["bookings"].push(data);
					})
					SPXCinema.serveJSON(r,{"bookingCode":bookCode});
				},
				[SPXCinema.DEFAULT_SYMBOL]: ()=>{
					SPXCinema.serveJSON(r,{});
				}
			},
			"": ()=>{SPXCinema.serveDynamic(r,"./src/dynamic/home.html")},
			"home": ()=>{SPXCinema.serveDynamic(r,"./src/dynamic/home.html")},
			"times": ()=>{SPXCinema.serveDynamic(r,"./src/dynamic/times.html")},
			"book": ()=>{SPXCinema.serveDynamic(r,"./src/dynamic/book.html")},
			"view": ()=>{SPXCinema.serveDynamic(r,"./src/dynamic/view.html")},
			[SPXCinema.DEFAULT_SYMBOL]: ()=>{
				SPXCinema.servePage(r);
			}
		});
		DATABASE.write();
	}
	return;
}
