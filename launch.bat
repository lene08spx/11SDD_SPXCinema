@ECHO OFF
SETLOCAL
SET DENO_DIR=.\bin\deno_dir\
CALL .\bin\deno.exe run .\src\main.ts
ENDLOCAL
PAUSE