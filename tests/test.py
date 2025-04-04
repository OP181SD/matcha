import requests

# URL du backend
url_login = "http://backend:5001/login"

data_login = {
    "identifier": "yassine",
    "password": "123"
}

response_login = requests.post(url_login, json=data_login)
if response_login.status_code == 200:
    print("✅ Test de connexion réussi!")
else:
    print(f"❌ Échec du test de connexion : {response_login.status_code}")
    
