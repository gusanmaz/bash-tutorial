import app as app_module


def test_hello():
    client = app_module.app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    assert b"Merhaba CI/CD" in response.data


def test_health():
    client = app_module.app.test_client()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}
