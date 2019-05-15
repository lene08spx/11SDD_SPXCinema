import { Http, Fs, Path } from "./deps.ts";

async function main () {
    
    const s = Http.serve("0.0.0.0:8080");
    for await (const r of s) {
        switch (r.url) {
            case "/":
            case "/":
        }
    }

}
main();
