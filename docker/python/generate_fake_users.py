import psycopg2
from faker import Faker
import bcrypt
import random
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    dbname=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT")
)
cur = conn.cursor()
fake = Faker('fr_FR')

FRENCH_CITIES = [
    ("Paris", 48.8566, 2.3522),
    ("Lyon", 45.7640, 4.8357),
    ("Marseille", 43.2965, 5.3698),
    ("Toulouse", 43.6047, 1.4442),
    ("Nice", 43.7102, 7.2620),
    ("Nantes", 47.2184, -1.5536),
    ("Strasbourg", 48.5734, 7.7521),
    ("Montpellier", 43.6108, 3.8767),
    ("Bordeaux", 44.8378, -0.5792),
    ("Lille", 50.6292, 3.0573),
    ("Rennes", 48.1173, -1.6778),
    ("Reims", 49.2583, 4.0317),
    ("Saint-Étienne", 45.4397, 4.3872),
    ("Toulon", 43.1242, 5.9280),
    ("Grenoble", 45.1885, 5.7245),
    ("Dijon", 47.3220, 5.0415),
    ("Angers", 47.4784, -0.5632),
    ("Nîmes", 43.8367, 4.3601),
    ("Aix-en-Provence", 43.5297, 5.4474),
    ("Brest", 48.3904, -4.4861),
    ("Le Mans", 48.0061, 0.1996),
    ("Clermont-Ferrand", 45.7797, 3.0863),
    ("Amiens", 49.8941, 2.2958),
    ("Limoges", 45.8336, 1.2611),
    ("Tours", 47.3941, 0.6848),
    ("Metz", 49.1193, 6.1757),
    ("Besançon", 47.2378, 6.0241),
    ("Orléans", 47.9029, 1.9039),
    ("Rouen", 49.4432, 1.0993),
    ("Caen", 49.1829, -0.3707),
]

AVAILABLE_INTERESTS = [
    'Musique', 'Dev Web', 'Voyages', 'Sport', 'Lecture',
    'Cinéma', 'Cuisine', 'Art', 'Jeux vidéo', 'Randonnée',
    'Photographie', 'Yoga', 'Danse', 'Mode', 'Animaux',
]

MALE_COUNT = 100
FEMALE_COUNT = 100

print("Insertion des tags...")
for tag in AVAILABLE_INTERESTS:
    cur.execute(
        "INSERT INTO tags (name) VALUES (%s) ON CONFLICT (name) DO NOTHING",
        (tag,)
    )

cur.execute("SELECT id FROM tags")
tag_ids = [row[0] for row in cur.fetchall()]

print("Insertion de 500 utilisateurs fictifs...")
for i in range(500):
    username = fake.user_name() + str(random.randint(10, 999))
    email = f"user{i}_{random.randint(1000,9999)}@matcha.fake"
    password = bcrypt.hashpw("Matcha42!".encode(), bcrypt.gensalt()).decode()

    cur.execute("""
        INSERT INTO users (username, email, password, is_verified)
        VALUES (%s, %s, %s, %s) RETURNING id
    """, (username, email, password, True))
    user_id = cur.fetchone()[0]

    gender = random.choice(['homme', 'femme'])
    sexual_pref = random.choice(['hétérosexuel', 'homosexuel', 'bisexuel'])
    first_name = fake.first_name_male() if gender == 'homme' else fake.first_name_female()
    city_name, lat, lon = random.choice(FRENCH_CITIES)

    lat += round(random.uniform(-0.05, 0.05), 6)
    lon += round(random.uniform(-0.05, 0.05), 6)

    gender_type = "men" if gender == "homme" else "women"
    gender_count = MALE_COUNT if gender == "homme" else FEMALE_COUNT
    avatar_index = i % gender_count
    image_url = f"https://randomuser.me/api/portraits/{gender_type}/{avatar_index}.jpg"

    cur.execute("""
        INSERT INTO profiles (
            user_id, first_name, last_name, gender, age,
            sexual_preferences, biography, fame_rating,
            latitude, longitude, city, image_url
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        user_id, first_name, fake.last_name(), gender,
        random.randint(18, 45), sexual_pref,
        fake.sentence(nb_words=12),
        random.randint(0, 100),
        lat, lon, city_name, image_url
    ))

    user_tags = random.sample(tag_ids, k=random.randint(2, 5))
    for tag_id in user_tags:
        cur.execute(
            "INSERT INTO profile_tags (profile_id, tag_id) VALUES (%s, %s)",
            (user_id, tag_id)
        )

    for j in range(3):
        pic_index = (i * 3 + j) % gender_count
        pic_url = f"https://randomuser.me/api/portraits/{gender_type}/{pic_index}.jpg"
        cur.execute("""
            INSERT INTO pictures (user_id, url, is_profile_picture)
            VALUES (%s, %s, %s)
        """, (user_id, pic_url, j == 0))

    if (i + 1) % 50 == 0:
        print(f"  {i + 1}/500 utilisateurs créés...")

conn.commit()
cur.close()
conn.close()
print("500 utilisateurs fictifs créés avec tags et photos adultes (randomuser.me).")
