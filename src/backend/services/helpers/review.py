from fastapi import HTTPException

from dao.aggregator import DAO


def get_fit_reviews(fit_id: str, dao: DAO) -> list[dict]:
    if not dao.fits.count({"fitID": fit_id}):
        raise HTTPException(status_code=404, detail="No such fit")

    return list(dao.reviews.find_many({"fitID": fit_id}))


def get_fit_reviews_stats(fit_id: str, dao: DAO) -> dict:
    fit_reviews = get_fit_reviews(fit_id, dao)
    total_reviews = len(fit_reviews)
    grades_sum = sum(review["grade"] for review in fit_reviews)
    avg_grade = grades_sum / total_reviews if total_reviews else 0

    return {"totalReviews": total_reviews, "avgGrade": avg_grade}
