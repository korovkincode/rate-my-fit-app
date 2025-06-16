import json


FIX_FILE = "frasers-Balenciaga.json"
EUR_TO_USD = 1.13


def fix_eur_to_usd(target_data: dict) -> dict:
    brand_name = [*target_data][0]
    for item_index in range(len(target_data[brand_name])):
        target_data[brand_name][item_index]["price"] *= EUR_TO_USD

    return target_data


with open(FIX_FILE, encoding="utf-8") as file:
    file_data = json.load(file)

fixed_data = fix_eur_to_usd(file_data)
with open(FIX_FILE, "w", encoding="utf-8") as fixed_file:
    json.dump(fixed_data, fixed_file, indent=4)
