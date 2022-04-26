import os 
import json
import subprocess
from subprocess import PIPE
# Creating the json dump for the data
d = {"q": []}
files = 15
dif = ['Easy','Hard', 'Hard','Hard', 'Hard','Medium','Medium','Medium','Medium','Medium','Medium','Medium','Medium','Medium','Medium']
for f in range(1, files+1):
    wc = str(f)+"wrongcode.cpp"
    rc = str(f)+"rightcode.cpp"
    tmp = {}
    tmp["questionid"] = str(f)
    tmp["difficulty"] = str(f)+dif[f-1]
    tmp["description"] = ""
    tmp["wrongcodefile"] = wc
    tmp["rightcodefile"] = rc
    with open(wc, "r") as w:
        tmp["wrongcode"] = w.read()
    with open(rc, "r") as r:
        tmp["rightcode"] = r.read()
    d["q"].append(tmp)
    compile_code1=subprocess.run(["g++", wc, "-o", wc[:-4]],stderr=PIPE)
    compile_code2 = subprocess.run(["g++", rc, "-o", rc[:-4]],stderr=PIPE)
with open("dataset.json", "w") as file:
    json.dump(d, file)

fnames = os.listdir('.')
fnames.remove('script.py')
