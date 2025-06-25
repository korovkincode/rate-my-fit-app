from dao.item import ItemDAO


def check_items(items_id: list[str], item_dao: ItemDAO) -> bool:
    for item_id in items_id:
        if item_dao.find_one({"itemID": item_id}) is None:
            return False
    return True


def get_total_price(items_id: list[str], item_dao: ItemDAO) -> float:
    total_price = 0
    for item_id in items_id:
        total_price += item_dao.find_one({"itemID": item_id})["price"]

    return total_price
