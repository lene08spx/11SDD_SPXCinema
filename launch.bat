@ECHO OFF
SETLOCAL
SET DENO_DIR=.\bin\deno_dir\
CALL .\bin\deno.exe run --allow-all .\src\main.ts
ENDLOCAL
PAUSE