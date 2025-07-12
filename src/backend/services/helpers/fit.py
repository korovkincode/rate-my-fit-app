from dao.aggregator import DAO
from services.helpers.item import get_total_price
from services.helpers.review import get_fit_reviews_stats


def get_fit_stats(fit_data: dict, dao: DAO) -> dict:
    total_price = get_total_price(fit_data.get("itemsID", []), dao)
    reviews_stats = get_fit_reviews_stats(fit_data["fitID"], dao)

    return {"totalPrice": total_price, **reviews_stats}


def update_fit_stats(fit_id: str, dao: DAO):
    fit_data = dao.fits.find_one({"fitID": fit_id})
    fit_data = {**fit_data, **get_fit_stats(fit_data, dao)}
    dao.fits.update_one({"fitID": fit_id}, fit_data.copy())
