data = {}
cities = []

import string

def ReadNOAAFile(filename,field):
    f = open(filename,"r")
    firstLine = True
    for line in f:
        if firstLine:
            firstLine = False
            continue
        city = string.capwords(line[5:38].strip()) # Normalize case
        city = city[:-2] + city[-2:].upper() # Fix state
        if city not in data: data[city] = {"country":"US"}
        months = line[43:].split()
        monthFloat = [float(months[i]) for i in range(12)]
        data[city][field] = {"imp":monthFloat}
    f.close()

def ReadNIWAFile(filename,field):
    f = open(filename,"r")
    for line in f:
        s = line.split(",")
        city = s[0].strip()
        if city not in data: data[city] = {"country":"NZ"}
        monthFloat = [float(s[i]) for i in range(1,13)]
        data[city][field] = {"met":monthFloat}
    f.close()


ReadNOAAFile("us_avg.txt","avg")
ReadNOAAFile("us_max.txt","max")
ReadNOAAFile("us_min.txt","min")
ReadNOAAFile("us_pcp.txt","pcp")

ReadNIWAFile("nz_avg.txt","avg")
ReadNIWAFile("nz_max.txt","max")
ReadNIWAFile("nz_min.txt","min")
ReadNIWAFile("nz_pcp.txt","pcp")

import json
f = open("data.json","w")
json.dump(data,f)
f.close()
