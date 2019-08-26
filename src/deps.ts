import * as DenoHttp 		from "../lib/deno_std/http/server.ts";
import * as DenoFs 			from "../lib/deno_std/fs/mod.ts";
import * as DenoPath 		from "../lib/deno_std/fs/path/mod.ts";
import * as DenoMediaTypes 	from "../lib/deno_std/media_types/mod.ts";
import * as SPXCinema 		from "./spxcinema.ts";

const _TxtEnc = new TextEncoder();
const _TxtDec = new TextDecoder();
const enc = (input?:string)=>{if(input)return _TxtEnc.encode(input);}
const dec = (input?:domTypes.BufferSource)=>{if(input)return _TxtDec.decode(input);}

export
{
	enc,
	dec,
	DenoHttp,
	DenoFs,
	DenoPath,
	DenoMediaTypes,
	SPXCinema
};