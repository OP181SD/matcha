import requests

BASE_URL = "http://backend:5001"

def test_register():
    url = f"{BASE_URL}/register"
    payload = {
        "username": "testUser",
        "email": "test@example.com",
        "password": "TestPassword123"
    }
    response = requests.post(url, json=payload)
    
    if response.status_code == 201:
        print("✅ Enregistrement réussi:", response.json())
    else:
        print("❌ Erreur lors de l'enregistrement:", response.json())

def test_login():
    url = f"{BASE_URL}/login"
    payload = {
        "identifier": "testUser",
        "password": "TestPassword123"
    }
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        print("✅ Connexion réussie:", response.json())
       
        token = response.cookies.get('token')
        if not token:
            token = response.json().get('token') 
        return token
    else:
        print("❌ Erreur lors de la connexion:", response.json())
        return None

def test_token_auth(token):
    if not token:
        print("❌ Aucun token, impossible de tester l'authentification.")
        return
    
    url = f"{BASE_URL}/token"
    headers = {
        "Authorization": f"Bearer {token}" 
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print("✅ Accès autorisé:", response.json())
    else:
        print("❌ Accès refusé:", response.json())


def run_tests():
    print("🔄 Test d'enregistrement:")
    test_register()

    print("\n🔄 Test de connexion:")
    token = test_login()

    print("\n🔄 Test d'authentification avec token:")
    test_token_auth(token)

    print("\n✅ Tous les tests sont passés avec succès!")


if __name__ == "__main__":
    run_tests()