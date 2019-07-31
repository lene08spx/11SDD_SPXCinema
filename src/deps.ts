import * as Http from "../lib/deno_std/http/server.ts";
import * as Fs from "../lib/deno_std/fs/mod.ts";
import * as Path from "../lib/deno_std/fs/path/mod.ts";

const MAIN_DIR = "./src/";
const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".jpeg": "image/jpeg"
};

export { Http, Fs, Path, MAIN_DIR, MIME_TYPES };