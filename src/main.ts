import { Http, Fs, Path, MAIN_DIR } from "./deps.ts";

async function serveContent (filename: string): Promise<void> {
    
}

async function main (): Promise<void> {
    const s = Http.serve("0.0.0.0:8080");
    for await (const r of s) {
        switch (r.url) {
            case "/main.css":
                
            default:
                serveContent(MAIN_DIR+"web/index.html");
                break;
        }
    }
    return;
}
main();
