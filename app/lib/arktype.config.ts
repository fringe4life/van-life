import { configure } from "arktype/config";

// Workers disallow `new Function` / eval. Must run before any `arktype` import.
configure({ jitless: true });
