from pydantic import BaseModel
from pydantic import model_validator
import json


class AbstractModel(BaseModel):
    #Removes all fields with null values
    def model_dump(self, *args, **kwargs):
        modelData = super().model_dump(*args, **kwargs)
        for field in [*modelData].copy():
            if modelData[field] is None:
                del modelData[field]
        return modelData
    
    
    @model_validator(mode="before")
    @classmethod
    def validateToJSON(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value