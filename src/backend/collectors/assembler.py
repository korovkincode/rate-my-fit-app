import os
import json
import uuid


TARGET_FOLDER = "parsed_data"
TARGET_FILES = [
    "frasers-Balenciaga.json",
    "stylight-Balenciaga.json",
    "stylight-Rick-Owens.json",
    "stylight-Vetements.json",
    "stylight-Timberland.json",
    "stylight-Maison-Margiela.json",
]
RESULT_FILE = "all-items.json"


general_data = []

for filename in TARGET_FILES:
    file_path = os.path.join(TARGET_FOLDER, filename)
    with open(file_path, encoding="utf-8") as file:
        file_data = json.load(file)
    brand_name = [*file_data][0]

    for item_data in file_data[brand_name]:
        item_data["price"] = int(item_data["price"] + 0.5)  # To round prices
        general_data.append(
            {
                "itemID": uuid.uuid4().hex,
                "brand": brand_name.replace("-", " "),
                **item_data,
            }
        )

general_file_path = os.path.join(TARGET_FOLDER, RESULT_FILE)
with open(general_file_path, "w", encoding="utf-8") as general_file:
    json.dump(general_data, general_file, indent=4)
