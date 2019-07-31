import { DenoHttp, DenoFs, DenoPath } from "./deps.ts";

const WEB_PORT = 80;
const WEB_ROOT = "./src/web"

async function servePage( r: DenoHttp.ServerRequest, filename?: string ): Promise<void>
{
    let filePath = WEB_ROOT + (filename || r.url);
    console.log(filePath);
    if (await DenoFs.exists( filePath ))
    {
        r.respond({
            "body": await Deno.readFile( filePath ),
            "status": 200
        });
    }
    else
    {
        r.respond({
            "body": new TextEncoder().encode("<!DOCTYPE html><h1>404</h1>"),
            "status": 404
        });
    }
}

async function main(): Promise<void>
{
    const s = DenoHttp.serve(`0.0.0.0:${WEB_PORT}`);
    console.log(`SPX Cinema @ http://localhost:${WEB_PORT}/`);
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
main();
