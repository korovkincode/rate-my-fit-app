from pydantic import BaseModel


class AbstractModel(BaseModel):
    #Removes all fields with null values
    def model_dump(self, *args, **kwargs):
        modelData = super().model_dump(*args, **kwargs)
        for field in [*modelData].copy():
            if modelData[field] is None:
                del modelData[field]
        return modelData