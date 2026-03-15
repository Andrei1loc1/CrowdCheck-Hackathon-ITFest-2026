from flask import Flask, jsonify, request
from Server.services.databaseService import *
from Server.services.analytics import *
from Server.database.client import supabase
import secrets

app = Flask(__name__)


@app.route("/get-details", methods=["POST"])
def getInstitutionDetails():
    data = request.json or {}
    key = data.get("key")
    
    if not key:
        return {"error": "Missing key in JSON body"}, 400
    return getInstitutionJSON(key)


@app.route("/save-person-count", methods=["POST"])
def savePersonCountEndpoint():
    data = request.json or {}
    key = data.get("key")
    count = data.get("count")
    if not key or count is None:
        return {"error": "Missing key or count in JSON body"}, 400

    try:
        saveCameraPing(key, count)
        
        return {
            "status": "success", 
            "message": f"Date salvate: {count}"
        }, 201
        
    except Exception as e:
        return {"error": f"Eroare la salvare: {str(e)}"}, 500


@app.route("/get-wait-time", methods=["POST"])
def getWaitTime():
    data = request.json or {}
    
    key = data.get("key")
    count = data.get("count")
    
    if not key:
        return {"error": "Missing key in JSON body"}, 400
    if count is None:
        return {"error": "Missing count in JSON body"}, 400
        
    body = getInstitutionJSON(key)
    if not body:
        return {"error": "Invalid key or institution not found"}, 404
        
    counters = body.get("counters")
    inst_type = body.get("type") 
    wait_time = calculateAvgWaitTime(count, inst_type, counters)
    
    return {"avg_wait_time": wait_time}, 200
    
    
    
@app.route("/trigger-analytics", methods=["POST"])
def trigger_analytics():
    data = request.json or {}
    key = data.get("key")
    type = data.get("type") 
    
    if not key:
        return {"error": "Key missing"}, 400
        
    if type == "hourly":
        result = process_hourly_average(key)
        return {"status": "Hourly average processed", "avg": result}, 200
    elif type == "daily":
        result = process_daily_average(key)
        return {"status": "Daily average processed", "avg": result}, 200
    
    return {"error": "Invalid type"}, 400


    
@app.route("/get-hourly-analytics", methods=["POST"])
def getHourlyAnalyticsRoute():
    data = request.json or {}
    key = data.get("key")
    
    if not key:
        return {"error": "Missing key in JSON body"}, 400
        
    analytics_data = getHourlyAnalytics(key)
    
    if not analytics_data:
        return {"msg": "No hourly data found"}, 404
        
    return {"analytics": analytics_data}, 200
    
    

@app.route("/get-daily-analytics", methods=["POST"])
def getDailyAnalytics():
    data = request.json or {}
    key = data.get("key")
    
    if not key:
        return {"error": "Missing key in JSON body"}, 400
        
    analytics_data = readDailyAnalytics(key)
    
    if not analytics_data:
        return {"msg": "No daily data found"}, 404
        
    return {"analytics": analytics_data}, 200


@app.route('/check-key', methods=['POST'])
def checkKey():
    req_data = request.json
    client_key = req_data.get("key")

    if not client_key:
        return jsonify({"status": "error", "message": "No key provided"}), 400
    
    try:
        query = supabase.table("user_keys").select("*").eq("key", client_key).execute()
        if len(query.data) > 0:
            return jsonify({
                "status": "ok",
                "message": "Key validated successfully",
            }), 200
        else:
            return jsonify({
                "status": "not found",
                "message": "The provided key does not exist"
            }), 404

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
    
@app.route('/create-key', methods=['POST'])
def createKey():
    req = request.json
    key = secrets.token_hex(16)
    
    try:
        response = supabase.table("user_keys").insert({
            "key" : key,
            "data" : req
        }).execute()
        
        
        return jsonify({"status": "ok", "key": key}), 200
        
    except Exception as e:
        
        return jsonify({"status": "error", "message": str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)