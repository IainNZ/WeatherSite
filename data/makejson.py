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
        city = string.capwords(line[5:37].strip()) # Normalize case
        city = city[:-2] + city[-2:].upper() # Fix state

        if city == "Havre, TX": city = "Havre, MT"
        if city == "Austin/city, TX": city = "Austin, TX"

        if city not in data:
            if field=="avgtemp":
                data[city] = {"country":"US"}
            else:
                print "Found city without avgtemp: ", city, "in", filename
                continue
        months = line[43:].split()
        for i in range(len(months)):
            if months[i].strip() == "*": months[i] = "0"
        monthFloat = [float(months[i]) for i in range(12)]
        data[city][field] = {"imp":monthFloat}
    f.close()

def ReadNIWAFile(filename,field):
    f = open(filename,"r")
    # Kill the first lines
    r = f.readline()
    r = f.readline()
    r = f.readline()
    r = f.readline()
    r = f.readline()
    r = f.readline()
    for line in f:
        s = line.split(",")
        if line[0] == '"': # Hack for Antarctica
            city = line.split('"')[1]
            s = s[1:]
        else:
            city = s[0].strip()
        if city not in data: data[city] = {"country":"NZ"}
        monthFloat = [float(s[i]) for i in range(1,13)]
        data[city][field] = {"met":monthFloat}
    f.close()


ReadNOAAFile("us_avgtemp.txt","avgtemp")
ReadNOAAFile("us_maxtemp.txt","maxtemp")
ReadNOAAFile("us_mintemp.txt","mintemp")
ReadNOAAFile("us_raindays.txt","raindays")
ReadNOAAFile("us_rainfall.txt","rainfall")
##ReadNOAAFile("us_sunperc.txt","sunperc")
# Remove incomplete entries
del data["Havre, MT"]
del data["Grand Forks, ND"]
del data["Austin/bergstrom, TX"]
del data["Dallas-love Field, TX"]

# Check every thing has all field
for k in data:
    allOK = True
    if not ('avgtemp' in data[k]):
        print k, "doesn't have avgtemp"
    if not ('maxtemp' in data[k]):
        print k, "doesn't have maxtemp"
    if not ('mintemp' in data[k]):
        print k, "doesn't have mintemp"
    if not ('raindays' in data[k]):
        print k, "doesn't have raindays"
    if not ('rainfall' in data[k]):
        print k, "doesn't have rainfall"
##    if not ('sunperc' in data[k]):
##        print k, "doesn't have sunperc"

ReadNIWAFile("nz_avgtemp.csv","avgtemp")
ReadNIWAFile("nz_maxtemp.csv","maxtemp")
ReadNIWAFile("nz_mintemp.csv","mintemp")
ReadNIWAFile("nz_raindays.csv","raindays")
ReadNIWAFile("nz_rainfall.csv","rainfall")
ReadNIWAFile("nz_sunhours.csv","sunhours")
del data["Antarctica, Scott Base"]
del data["Te Anau"]
del data["Whangarei"]
del data["Milford Sound"]
del data["Manapouri"]

import json
f = open("data.json","w")
json.dump(data,f)
f.close()
