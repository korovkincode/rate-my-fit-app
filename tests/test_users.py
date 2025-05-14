import sys
sys.path.append('../src/backend/')
from fastapi.testclient import TestClient
from app import app


client = TestClient(app)

testUser = {
    "username": "testuser",
    "password": "testpass",
    "bio": "none"
}
userCredentials = {}


def test_add_user():
    response = client.post("/user/add", json=testUser)
    assert response.status_code == 200


def test_auth_user():
    response = client.post("/user/auth", json={
        "username": testUser["username"],
        "password": testUser["password"]
    })
    assert response.status_code == 200
    data = response.json()["data"]
    userCredentials.update(data)


def test_get_user_public():
    response = client.get(f"/user/@{testUser['username']}")
    assert response.status_code == 200
    assert response.json()["data"]["username"] == testUser["username"]


def test_get_user_private():
    headers = {"secretToken": userCredentials["secretToken"]}
    response = client.get(f"/user/{userCredentials['userToken']}", headers=headers)
    assert response.status_code == 200
    assert response.json()["data"]["username"] == testUser["username"]


def test_update_user():
    update_data = {
        "username": testUser["username"],
        "password": testUser["password"],
        "bio": "test update",
        "userCredentials": {
            "userToken": userCredentials["userToken"],
            "secretToken": userCredentials["secretToken"]
        }
    }
    response = client.put(f"/user/{userCredentials['userToken']}", json=update_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Successful update"