import urllib.request
import zipfile
import os

# Install
#   Deno
#   Deno_Std
# Setup
#   Deno Type-Defs

BIN_DIR = "./bin/"
LIB_DIR = "./lib/"

DENO_URL = "https://github.com/denoland/deno/releases/download/v0.5.0/deno_win_x64.zip"
DENO_STD_URL = "https://github.com/denoland/deno_std/archive/v0.5.0.zip"

# Ensure Directories
if not os.path.exists(BIN_DIR):
    os.makedirs(BIN_DIR)
if not os.path.exists(LIB_DIR):
    os.makedirs(LIB_DIR)

print("Running Development Setup")
print()

zips = [
    ("Deno Binary", DENO_URL, BIN_DIR),
    ("Deno Standard Library", DENO_STD_URL, LIB_DIR)
]
TEMP_ZIP = "./bin/temp.zip"
# Install Zips
for z in zips:
    # Open URL
    print("Retrieving", z[0], z[1])
    fileUrl = urllib.request.urlopen(z[1])

    # Download File
    print("Downloading Data ...")
    fileData = fileUrl.read()

    # Save File
    print("Writing to Disk ...")
    with open(TEMP_ZIP, 'wb+') as f:  
        f.write(fileData)

    # Extract Zip to Folder
    print("Extracting ...")
    zip_ref = zipfile.ZipFile(TEMP_ZIP,"r")
    zip_ref.extractall(z[2])
    zip_ref.close()

    # Finish/Cleanup
    os.remove(TEMP_ZIP)
    print("Successfully Extracted", z[0], "!")
    print()

os.rename("lib/deno_std-0.5.0","lib/deno_std")
os.system(".\\bin\\deno.exe types > .\\lib\\lib.deno.d.ts")
print("Done! :-)")