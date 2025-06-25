from dao.item import ItemDAO
from dao.review import ReviewDAO
from services.helpers.item import get_total_price
from services.helpers.review import get_fit_reviews_stats


def get_fit_stats(fit_data: dict, item_dao: ItemDAO, review_dao: ReviewDAO) -> dict:
    total_price = get_total_price(fit_data.get("itemsID", []), item_dao)
    reviews_stats = get_fit_reviews_stats(fit_data["fitID"], review_dao)

    return {"totalPrice": total_price, **reviews_stats}
