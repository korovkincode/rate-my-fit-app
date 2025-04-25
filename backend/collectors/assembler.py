import json
import uuid
import math


ITEMS_FILES = [
    "frasers-Balenciaga.json", "stylight-Balenciaga.json", "stylight-Rick-Owens.json",
    "stylight-Vetements.json", "stylight-Timberland.json", "stylight-Maison-Margiela.json"
]

generalData = []


for filename in ITEMS_FILES:
    with open(filename, encoding="utf-8") as file:
        fileData = json.load(file)
    brandName = [*fileData][0]

    for itemData in fileData[brandName]:
        itemData["price"] = int(itemData["price"] + 0.5) #To round prices
        generalData.append({
            "itemID": uuid.uuid4().hex,
            "brand": brandName.replace("-", " "),
            **itemData
        })


with open("all-items.json", "w", encoding="utf-8") as generalFile:
    json.dump(generalData, generalFile, indent=4)


'''
Item structure:
ID, brand, name, img, price (all in USD), *category (Optional)
'''