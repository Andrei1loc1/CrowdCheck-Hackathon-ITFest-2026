import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Server.database.client import supabase

def savePersonCount(key:str, count:int):
    supabase.table("user_keys").update({"count": count}).eq("key", key).execute()