import json
import os
import time

from bs4 import BeautifulSoup as BS
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains


DRIVER_PATH = os.path.join("assets", "chromedriver.exe")
BASE_URL = "https://www.stylight.com"
BRAND_NAME = "Maison-Margiela"
PAGE_NUM = 99


def parse_page(page: int):
    page_url = f"{BASE_URL}/{BRAND_NAME}/?page={page}"
    driver.get(page_url)
    time.sleep(3)

    if page == 0:  # To avoid initial human check
        input()

    for window_y in range(0, 10000 + 1, 500):
        driver.execute_script(
            f"window.scrollTo(0, {window_y});"
        )  # To load all the product pictures
        time.sleep(0.5)

    page_html = driver.page_source
    page_soup = BS(page_html, "html.parser")

    for catalog_item in page_soup.find("div", {"class": "productsSection"}).find_all(
        "div", {"class": "product-preview"}
    ):
        item_name = catalog_item.find(
            "p", {"class": "product-preview__name"}
        ).text.strip()
        item_img = catalog_item.find("img", {"class": "product-preview__image"}).get("src")
        item_price = catalog_item.find_all("span", {"class": "product-preview__price"})[
            -1
        ].text.strip()
        item_price = float(item_price.replace("$", "").replace(",", ""))

        if item_img is None:
            raise RuntimeError("NO IMAGE URL!")

        collected_data[BRAND_NAME].append({
            "name": item_name,
            "img": item_img,
            "price": item_price
        })


driver = webdriver.Chrome(DRIVER_PATH)
actions = ActionChains(driver)

collected_data = {BRAND_NAME: []}

for current_page in range(0, PAGE_NUM + 1):
    parse_page(current_page)

with open(f"stylight-{BRAND_NAME}.json", "w", encoding="utf-8") as result_file:
    json.dump(collected_data, result_file, indent=4)
