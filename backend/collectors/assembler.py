import json
import uuid


WORK_FILES = [
    "frasers-Balenciaga.json", "stylight-Balenciaga.json", "stylight-Rick-Owens.json",
    "stylight-Vetements.json", "stylight-Timberland.json", "stylight-Maison-Margiela.json"
]

generalData = []


for filename in WORK_FILES:
    with open(filename, encoding="utf-8") as file:
        fileData = json.load(file)
    brandName = [*fileData][0]
    
    for itemData in fileData[brandName]:
        generalData.append({
            "ID": uuid.uuid4().hex,
            "brand": brandName.replace("-", " "),
            **itemData
        })


with open("all-items.json", "w") as generalFile:
    json.dump(generalData, generalFile, indent=4)