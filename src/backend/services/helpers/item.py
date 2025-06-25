from dao.aggregator import DAO


def check_items(items_id: list[str], dao: DAO) -> bool:
    for item_id in items_id:
        if dao.items.find_one({"itemID": item_id}) is None:
            return False
    return True


def get_total_price(items_id: list[str], dao: DAO) -> float:
    total_price = 0
    for item_id in items_id:
        total_price += dao.items.find_one({"itemID": item_id})["price"]

    return total_price
