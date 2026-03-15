import json
import time # [!] Import nou necesar pentru pauza de 1 minut
from pygrabber.dshow_graph import FilterGraph
from keyService import getKey, fetchKey
from analysis import findPersonCountAprox
from utils import savePersonCount

CONFIG_FILE = "config.json"

def get_saved_config():
    try:
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_config(key_value, camera_index):
    with open(CONFIG_FILE, "w") as f:
        json.dump({"key": key_value, "camera_index": camera_index}, f, indent=4)

def select_camera():
    """Doar selecteaza camera si returneaza indexul."""
    print("\n--- Selectare Camera ---")
    graph = FilterGraph()
    devices = graph.get_input_devices()
    for index, name in enumerate(devices):
        print(f"[{index}] {name}")
        
    camera_index = input("\nSelecteaza camera (index) care va captura actiunea: ")
    return camera_index

def start_tracking(key, camera_index):
    """Ruleaza la infinit: analizeaza 10 secunde, salveaza, asteapta 60 secunde."""
    print(f"\n--- Pornire automata pe camera cu indexul [{camera_index}] ---")
    print("Apasa Ctrl+C in terminal pentru a opri programul.\n")

    # Bucla infinita
    while True:
        try:
            print("[INFO] Pornesc camera si analizez pentru 10 secunde...")
            
            # Aici presupunem ca functia ta deschide camera, analizeaza si apoi o INCHIDE
            count = findPersonCountAprox(camera_index)    
            savePersonCount(key, count)
            
            print(f"[INFO] Date salvate cu succes! Numar persoane: {count}")
            print("[INFO] Opresc camera. Urmeaza o pauza de 60 de secunde...\n")
            
            time.sleep(60) # Pauza de 1 minut
            
        except KeyboardInterrupt:
            # Permite oprirea curata a scriptului cand apesi Ctrl+C
            print("\n[INFO] Program oprit de utilizator.")
            break
        except Exception as e:
            print(f"\n[EROARE] A aparut o problema in timpul rularii: {e}")
            time.sleep(10) # Daca da o eroare (ex: pica netul), asteapta 10 secunde inainte sa incerce din nou

def crowdcheck():
    print(r"""        
    ______                      __   ________            __  
   / ____/________ _      ______/ /  / ____/ /_  ___  _____/ /__
  / /   / ___/ __ \ | /| / / __  /  / /   / __ \/ _ \/ ___/ //_/
 / /___/ /  / /_/ / |/ |/ / /_/ /  / /___/ / / /  __/ /__/ ,<   
 \____/_/   \____/|__/|__/\__,_/   \____/_/ /_/\___/\___/_/|_|  
          """)
    print("Bine ati venit la Crowd Check!")

    config = get_saved_config()
    saved_key = config.get("key")
    saved_camera = config.get("camera_index")

    # 1. Autentificare din config
    if saved_key and fetchKey(saved_key):
        print(f"\nAutentificat automat cu cheia: {saved_key}")
        
        if saved_camera is None:
            saved_camera = select_camera()
            save_config(saved_key, saved_camera)
            
        start_tracking(saved_key, saved_camera)
        return  

    # 2. Meniu principal daca nu exista config valid
    print("\nSelecteaza una dintre urmatoarele optiuni:")
    print('1. Autentificare cont existent')
    print('2. Configurare cont nou')
    
    choice = input("Alegerea ta: ")
    
    if choice == "1":
        key = input("\nIntrodu cheia de acces: ")
        if fetchKey(key):
            print("\nAutentificare reusita!")
            camera_index = select_camera()
            save_config(key, camera_index) # Salvam configuratia inainte de bucla infinita
            start_tracking(key, camera_index)
        else:
            print("\nCheia introdusa nu este valida sau nu exista.")
            
    elif choice == "2":
        name = input("\nIntrodu numele institutiei: ")
        lat = input("Latitudinea: ")
        long = input("Longitudinea: ")
        
        print("\nCategorii: 1.Primarie 2.Documente 3.Sanatate 4.Posta 5.Banci 6.Transport 7.Utilitati 8.Educatie")
        ins_type = input("Alege categoria (1-8): ")
        counters = input("Nr de ghisee: ")
        
        new_key = getKey(name, lat, long, ins_type, counters)
        
        if new_key:
            print(f"\nCont creat cu succes! Cheia ta este: {new_key}")
            camera_index = select_camera()
            save_config(new_key, camera_index) # Salvam configuratia
            start_tracking(new_key, camera_index)
        else:
            print(f"\nEroare: Nu am putut crea contul pentru {name}.")
            
    else: 
        print("\nOptiune invalida")

if __name__ == "__main__":
    crowdcheck()