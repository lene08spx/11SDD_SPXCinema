import { Http, Fs, Path, MAIN_DIR } from "./deps.ts";

const PORT = 80;

async function serveContent (filename: string): Promise<Uint8Array> {
    return await Deno.readFile(filename);
}

async function main (): Promise<void> {
    const s = Http.serve(`0.0.0.0:${PORT}`);
    console.log(`SPX Cinema @ http://localhost:80/`);
    for await (const r of s) {
        switch (r.url) {
            case "/":
                r.respond({
                    body: await serveContent(MAIN_DIR+"web/index.html"),
                    status: 200
                });
                break;
            default:
                
                break;
        }
    }
    return;
}
main();
