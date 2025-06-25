from dao.review import ReviewDAO


def get_fit_reviews_stats(fit_id: str, review_dao: ReviewDAO) -> dict:
    fit_reviews = list(review_dao.find_many({"fitID": fit_id}))
    total_reviews = len(fit_reviews)
    grades_sum = sum(review["grade"] for review in fit_reviews)
    avg_grade = grades_sum / total_reviews if total_reviews else 0

    return {"totalReviews": total_reviews, "avgGrade": avg_grade}
