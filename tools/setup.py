import urllib.request
import zipfile
import os

# Install
#  Deno
#  

BIN_DIR = "./bin/"

# Ensure Directories
if not os.path.exists(BIN_DIR):
    os.makedirs(BIN_DIR+"deno/")


# Download Deno Binary

# Open URL
print("Retrieving Deno Binary")
filedata = urllib.request.urlopen("https://github.com/denoland/deno/releases/download/v0.5.0/deno_win_x64.zip")

# Download File
print("Downloading Data")
datatowrite = filedata.read()

# Write Zip To File
print("Writing to Disk")
with open(BIN_DIR+"deno.zip", 'wb+') as f:  
    f.write(datatowrite)

# Extract Zip to Folder
print("Extracting")
zip_ref = zipfile.ZipFile(BIN_DIR+"deno.zip","r")
zip_ref.extractall(BIN_DIR+"deno/")
zip_ref.close()

os.remove(BIN_DIR+"deno.zip")
print("Done!")
