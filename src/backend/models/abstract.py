import json

from pydantic import BaseModel, model_validator


class AbstractModel(BaseModel):
    # Removes all fields with null values
    def model_dump(self, *args, **kwargs):
        model_data = super().model_dump(*args, **kwargs)
        for field in [*model_data].copy():
            if model_data[field] is None:
                del model_data[field]
        return model_data

    @model_validator(mode="before")
    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value
