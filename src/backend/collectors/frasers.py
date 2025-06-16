import os
import json
import time

from bs4 import BeautifulSoup as BS
from selenium import webdriver


DRIVER_PATH = os.path.join("assets", "chromedriver.exe")
BASE_URL = "https://www.houseoffraser.ie/brand"
BRAND_NAME = "Balenciaga"
PAGE_NUM = 10
ITEMS_PER_PAGE = 59


def parse_page(page: int):
    page_url = f"{BASE_URL}/{BRAND_NAME}?dcp={page}&dppp={ITEMS_PER_PAGE}&OrderBy=rank"
    driver.get(page_url)
    time.sleep(5)
    page_html = driver.page_source
    page_soup = BS(page_html, "html.parser")

    for catalog_item in page_soup.find("div", {"id": "productlistcontainer"}).find_all("li"):
        if catalog_item.get("li-name") is None:
            continue

        item_name = catalog_item.get("li-name")
        item_img = catalog_item.get("li-imageurl")
        item_price = float(catalog_item.get("li-price"))
        item_category = catalog_item.get("li-category")
        collected_data[BRAND_NAME].append({
            "name": item_name,
            "img": item_img,
            "price": item_price,
            "category": item_category,
        })


driver = webdriver.Chrome(DRIVER_PATH)

collected_data = {BRAND_NAME: []}

for current_page in range(1, PAGE_NUM + 1):
    parse_page(current_page)

with open(f"frasers-{BRAND_NAME}.json", "w", encoding="utf-8") as result_file:
    json.dump(collected_data, result_file, indent=4)
