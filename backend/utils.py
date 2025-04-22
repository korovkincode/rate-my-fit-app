from typing import List
from fastapi import UploadFile
import uuid
import os


def getFileExtension(filename: str) -> str:
    return filename[filename.rindex("."):]


def collectPics(pics: list[UploadFile], picStatus: dict) -> List[str]:
    if not picStatus["flag"] and picStatus.get("picnames", None):
        for picname in picStatus["picnames"]:
            os.remove(os.path.join("static", picname))

    picnames = [] if not picStatus["flag"] else picStatus["picnames"]
    for pic in pics:
        picID = uuid.uuid4().hex
        picname = picID + getFileExtension(pic.filename)
        with open(os.path.join("static", picname), "wb") as f:
            f.write(pic.file.read())
        picnames.append(picname)
    return picnames