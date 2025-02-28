from flask import Flask, jsonify, request  # Flask's request module
from flask_cors import CORS

import request.request as req  # Import your custom 'request' module with alias 'req'
import controller.auth.auth as user
import controller.attraction as attraction

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, Docker!'

# Attraction
@app.post('/attraction')
def addAttraction():
    print("okok", flush=True)
    # Fonction vérif token
    checkToken = user.check_token(request)
    if (checkToken != True):
        return checkToken

    json = request.get_json()
    retour = attraction.add_attraction(json)
    if (retour):
        return jsonify({"message": "Element ajouté.", "result": retour}), 200
    return jsonify({"message": "Erreur lors de l'ajout.", "result": retour}), 500

@app.get('/attraction')
def getAllAttraction():
    result = attraction.get_all_attraction()
    return result, 200

@app.get('/attraction/<int:index>')
def getAttraction(index):
    result = attraction.get_attraction(index)
    return result, 200

@app.delete('/attraction/<int:index>')
def deleteAttraction(index):

    # Fonction vérif token
    checkToken = user.check_token(request)
    if (checkToken != True):
        return checkToken

    json = request.get_json()

    if (attraction.delete_attraction(index)):
        return "Element supprimé.", 200
    return jsonify({"message": "Erreur lors de la suppression."}), 500

@app.post('/login')
def login():
    json = request.get_json()

    if (not 'name' in json or not 'password' in json):
        result = jsonify({'messages': ["Nom ou/et mot de passe incorrect"]})
        return result, 400

    cur, conn = req.get_db_connection()
    requete = f"SELECT * FROM users WHERE name = '{json['name']}' AND password = '{json['password']}';"
    cur.execute(requete)
    records = cur.fetchall()
    conn.close()

    result = jsonify({"token": user.encode_auth_token(list(records[0])[0]), "name": json['name']})
    return result, 200

@app.get('/critique')
def get_critique():
    attraction_id = request.args.get('attraction_id')  # Corrected to use Flask's request object
    if attraction_id:
        # Sélectionne uniquement les critiques correspondant à l'attraction spécifiée
        sql = "SELECT * FROM critiques WHERE attraction_id = %s"
        json = req.select_from_db(sql, (attraction_id,))  # Use 'req' for database query
    else:
        # Si aucun ID n'est spécifié, récupère toutes les critiques
        sql = "SELECT * FROM critiques"
        json = req.select_from_db(sql)  # Use 'req' for database query
    return json, 200

@app.post('/critique')
def critique():
    json = request.get_json()

    # Validation des champs obligatoires
    if 'attraction_id' not in json or not json['attraction_id']:
        return jsonify({"message": "attraction_id est obligatoire"}), 400

    if 'text' not in json or 'note' not in json:
        return jsonify({"message": "text et note sont obligatoires"}), 400

    nom = json.get('nom', None)
    prenom = json.get('prenom', None)

    try:
        # Connexion à la base de données
        cur, conn = req.get_db_connection()
        requete = "INSERT INTO critiques (attraction_id, text, note, nom, prenom) VALUES (%s, %s, %s, %s, %s);"
        cur.execute(requete, (json['attraction_id'], json['text'], json['note'], nom, prenom))
        conn.commit()
        conn.close()

        return jsonify({"message": "Critique ajoutée avec succès"}), 200
    except Exception as e:
        # Enregistrement de l'erreur et réponse avec message détaillé
        print(f"Erreur lors de l'insertion dans la base de données : {str(e)}")
        return jsonify({"message": "Erreur interne lors de l'ajout de la critique"}), 500
