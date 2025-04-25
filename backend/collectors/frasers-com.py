from selenium import webdriver
from bs4 import BeautifulSoup as BS
import json
import time


driver = webdriver.Chrome()
BASE_URL = "https://www.houseoffraser.ie/brand"
BRAND_NAME = "Balenciaga"
PAGE_NUM = 10
ITEMS_PER_PAGE = 59


def parsePage(page: int):
    global collectedData

    pageURL = f"{BASE_URL}/{BRAND_NAME}?dcp={page}&dppp={ITEMS_PER_PAGE}&OrderBy=rank"
    driver.get(pageURL)
    time.sleep(5)
    pageHTML = driver.page_source
    pageSoup = BS(pageHTML, "html.parser")

    for catalogItem in pageSoup.find("div", {"id": "productlistcontainer"}).find_all("li"):
        if catalogItem.get("li-name") is None:
            continue
        itemName = catalogItem.get("li-name")
        itemImg = catalogItem.get("li-imageurl")
        itemPrice = float(catalogItem.get("li-price"))
        itemCategory = catalogItem.get("li-category")
        collectedData[BRAND_NAME].append({
            "name": itemName, "img": itemImg,
            "price": itemPrice, "category": itemCategory
        })


collectedData = {BRAND_NAME: []}

for page in range(1, PAGE_NUM + 1):
    parsePage(page)


with open(f"frasers-{BRAND_NAME}.json", "w", encoding="utf-8") as f:
    json.dump(collectedData, f, indent=4)