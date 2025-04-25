import json


FIX_FILE = "frasers-Balenciaga.json"
EUR_TO_USD = 1.13


def fixEURToUSD(fileData: dict) -> dict:
    global EUR_TO_USD

    brandName = [*fileData][0]
    for itemIndex in range(len(fileData[brandName])):
        fileData[brandName][itemIndex]["price"] *= EUR_TO_USD

    return fileData


with open(FIX_FILE, encoding="utf-8") as file:
    fileData = json.load(file)

fixedData = fixEURToUSD(fileData)
with open(FIX_FILE, "w", encoding="utf-8") as fixedFile:
    json.dump(fixedData, fixedFile, indent=4)