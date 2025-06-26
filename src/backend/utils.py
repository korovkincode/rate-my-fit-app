import os
import uuid

from fastapi import HTTPException, UploadFile

from config.database import Database


def get_file_extension(filename: str) -> str:
    return filename[filename.rindex(".") :]


def get_file_basename(filename: str) -> str:
    return filename[: filename.rindex(".")]


def collect_pics(pics: list[UploadFile], pic_status: dict) -> list[str]:
    if not pic_status["flag"] and pic_status.get("picnames", None):
        for picname in pic_status["picnames"]:
            os.remove(os.path.join("static", picname))

    picnames = [] if not pic_status["flag"] else pic_status["picnames"]
    for pic in pics:
        pic_id = uuid.uuid4().hex
        picname = pic_id + get_file_extension(pic.filename)
        with open(os.path.join("static", picname), "wb") as f:
            f.write(pic.file.read())
        picnames.append(picname)

    return picnames


def find_pfp(user_token: str) -> str:
    pfp_files = os.listdir("pfp")
    for filename in pfp_files:
        if user_token == get_file_basename(filename):
            return filename

    raise HTTPException(status_code=404, detail="No pfp for this user")
