import requests

def fetchKey(key: str):
    url = "http://127.0.0.1:5000/check-key"
    payload = {"key": key}
    
    try:
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            return True
        elif response.status_code == 404:
            return False
        else:
            try:
                result = response.json()
                print(f"Server Error: {result.get('message', 'Unknown error')}")
            except requests.exceptions.JSONDecodeError:
                print(f"Server Error: Status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server.")
        return False


def getKey(name: str, lat: str, long: str, type: str, counters:int):
    url = "http://127.0.0.1:5000/create-key"
    payload = {
        "name" : name,
        "lat" : lat,
        "long" : long,
        "type" : type,
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            try:
                result = response.json()
                return result.get("key")
            except requests.exceptions.JSONDecodeError:
                return response.text 
                
        else:
            try:
                result = response.json()
                print(f"\n[Eroare Server]: {result.get('message', 'Eroare necunoscuta')}")
            except requests.exceptions.JSONDecodeError:
                print(f"\n[Eroare Server]: Status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n[Eroare]: Nu m-am putut conecta la server. Verifica daca app.py ruleaza.")
        return False