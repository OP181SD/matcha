#!/bin/bash

# Script de test pour l'API Matcha
# Utilisation : ./test_api.sh [host] [port]

# Variables par défaut
HOST=${1:-localhost}
PORT=${2:-5001}
BASE_URL="http://$HOST:$PORT"
COOKIE_FILE="./cookies.txt"

# Couleurs pour la sortie
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
function print_message() {
  echo -e "${BLUE}==>${NC} $1"
}

# Fonction pour tester une route et afficher le résultat
function test_route() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4
  local extra_args=$5
  
  print_message "$description"
  echo "Requête: $method $BASE_URL$endpoint"
  
  local response
  
  if [ "$method" == "GET" ]; then
    response=$(curl -s -X $method "$BASE_URL$endpoint" $extra_args)
  else
    response=$(curl -s -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      $extra_args \
      -d "$data")
  fi
  
  echo "Réponse: $response"
  echo "----------------------------------------"
}

# Supprimer l'ancien fichier de cookies s'il existe
if [ -f "$COOKIE_FILE" ]; then
  rm "$COOKIE_FILE"
fi

print_message "Démarrage des tests pour l'API sur $BASE_URL"
echo "----------------------------------------"

# Test d'inscription
test_route "POST" "/register" '{"username": "testuser", "email": "testuser@example.com", "password": "password123", "confirmPassword": "password123"}' "1. Test d'inscription"

# Test de connexion
test_route "POST" "/login" '{"log": "testuser", "password": "password123"}' "2. Test de connexion" "-c $COOKIE_FILE"

# # Test de vérification du token
# test_route "GET" "/token" "" "3. Test de vérification du token" "-b $COOKIE_FILE"

# # Test du cookie
# test_route "GET" "/test-cookie" "" "4. Test du cookie" "-b $COOKIE_FILE"

# Test de mise à jour du profil
test_route "PUT" "/update" '{"username": "updateuser", "id": 1}' "5. Test de mise à jour du nom d'utilisateur" "-b $COOKIE_FILE"

# Test de création/mise à jour du profil
profile_data='{
  "first_name": "John",
  "last_name": "Doe",
  "gender": "male",
  "age": "26",
  "sexual_preferences": "heterosexual",
  "biography": "Je suis un développeur passionné",
  "latitude": 48.856614,
  "longitude": 2.3522219,
  "image_url": "https://example.com/image.jpg"
}'
test_route "POST" "/profile" "$profile_data" "6. Test de création/mise à jour du profil" "-b $COOKIE_FILE"

# Test d'ajout de tags
test_route "POST" "/tags/add" '{"tags": ["sport", "lecture", "musique"]}' "7. Test d'ajout de tags" "-b $COOKIE_FILE"

# Test de récupération des likes
test_route "GET" "/likes" "" "8. Test de récupération des likes" "-b $COOKIE_FILE"

# Test de récupération des vues
test_route "GET" "/views" "" "9. Test de récupération des vues" "-b $COOKIE_FILE"

# Test de récupération d'un profil par ID
test_route "GET" "/profile/1" "" "10. Test de récupération d'un profil par ID" "-b $COOKIE_FILE"

# Test d'upload d'image (commenté car nécessite un fichier réel)
echo -e "${BLUE}==>${NC} 11. Test d'upload d'image (exemple à adapter avec un vrai fichier)"
echo "curl -X POST \"$BASE_URL/picture/upload\" -b $COOKIE_FILE -H \"Content-Type: multipart/form-data\" -F \"picture=@/chemin/vers/image.jpg\""
echo "----------------------------------------"

print_message "Fin des tests"
