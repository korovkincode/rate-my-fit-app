from typing import List
import uuid
import os


def getFileExtension(filename) -> str:
    return filename[filename.rindex("."):]


def collectPics(pics) -> List[str]:
    picnames = []
    for pic in pics:
        picID = uuid.uuid4().hex
        picName = picID + getFileExtension(pic.filename)
        with open(os.path.join("static", picName), "wb") as f:
            f.write(pic.file.read())
        picnames.append(picName)
    return picnames