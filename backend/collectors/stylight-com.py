from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup as BS
import json
import time


driver = webdriver.Chrome()
actions = ActionChains(driver)
BASE_URL = "https://www.stylight.com"
BRAND_NAME = "Maison-Margiela"
PAGE_NUM = 99


def parsePage(page: int):
    global collectedData

    pageURL = f"{BASE_URL}/{BRAND_NAME}/?page={page}"
    driver.get(pageURL)
    time.sleep(3)

    if page == 0: #To avoid initial human check
        input()

    for Y in range(0, 10000 + 1, 500):
        driver.execute_script(f"window.scrollTo(0, {Y});") #To load all the product pictures
        time.sleep(0.5)

    pageHTML = driver.page_source
    pageSoup = BS(pageHTML, "html.parser")

    for catalogItem in pageSoup.find("div", {"class": "productsSection"}).find_all("div", {"class": "product-preview"}):
        itemName = catalogItem.find("p", {"class": "product-preview__name"}).text.strip()
        itemImg = catalogItem.find("img", {"class": "product-preview__image"}).get("src")
        itemPrice = catalogItem.find_all("span", {"class": "product-preview__price"})[-1].text.strip()
        itemPrice = float(itemPrice.replace("$", "").replace(",", ""))
        
        if itemImg is None:
            print("NO IMAGE URL!")
            exit()

        collectedData[BRAND_NAME].append({
            "name": itemName, "img": itemImg, "price": itemPrice
        })


collectedData = {BRAND_NAME: []}

for page in range(0, PAGE_NUM + 1):
    parsePage(page)

with open(f"stylight-{BRAND_NAME}.json", "w", encoding="utf-8") as f:
    json.dump(collectedData, f, indent=4)