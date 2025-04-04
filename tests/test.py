import requests


url_login = "http://backend:5001/login"
url_signup = "http://backend:5001/register"

# Données pour les tests
data_login = {
    "identifier": "yassine",
    "password": "123"
}

data_signup = {
    "username": "xxx",
    "email": "xxx@example.com", 
    "password": "123"
}

# Test de connexion
response_login = requests.post(url_login, json=data_login)
if response_login.status_code == 200:
    print("✅ Test de connexion réussi!")
else:
    print(f"❌ Échec du test de connexion : {response_login.status_code}")

# Test d'inscription
response_signup = requests.post(url_signup, json=data_signup)
if response_signup.status_code == 201:  
    print("✅ Test d'inscription réussi!")
else:
    print(f"❌ Échec du test d'inscription : {response_signup.status_code}")
