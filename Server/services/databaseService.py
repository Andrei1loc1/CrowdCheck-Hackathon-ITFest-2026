from Server.database.client import supabase
from datetime import datetime, timezone, timedelta
from Server.Utils.crtday import getDay


def saveHourlyQueue(key: str, count: int):
    try:
        now = datetime.now(timezone.utc)
        hourly_timestamp = now.replace(minute=0, second=0, microsecond=0)
        
        entry = {
            "key": key,
            "count": count,
            "time": hourly_timestamp.isoformat() 
        }
        
        response = supabase.table("hourly_queue_logs").insert(entry).execute()
        print(f"✅ Queue saved for {id}")

    except Exception as e:
        print(f"❌ Error: {e}")


def process_hourly_average(key: str):
    now = datetime.now(timezone.utc)
    one_hour_ago = now - timedelta(hours=1)
    
    response = supabase.table("raw_camera_logs").select("count")\
        .eq("key", key)\
        .gte("time", one_hour_ago.isoformat()).execute()
    
    counts = [row["count"] for row in response.data]
    
    if counts:
        avg = sum(counts) // len(counts)
        supabase.table("hourly_queue_logs").insert({"key": key, "count": avg, "time": now.isoformat()}).execute()
        return avg
    return 0


def process_daily_average(key: str):
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    response = supabase.table("raw_camera_logs").select("count")\
        .eq("key", key)\
        .gte("time", today_start.isoformat()).execute()
    
    counts = [row["count"] for row in response.data]
    
    if counts:
        avg = sum(counts) // len(counts)
        supabase.table("daily_queue_logs").insert({"key": key, "count": avg, "day": datetime.now().strftime("%Y-%m-%d")}).execute()
        return avg
    return 0



def saveDailyQueue(key: str, count: int):
    try:
        entry = {
            "key": key,
            "count": count,
            "day": getDay()
        }
        
        response = supabase.table("daily_queue_logs").insert(entry).execute()
        print(f"✅ Queue saved for {key} on {getDay()}")

    except Exception as e:
        print(f"❌ Error: {e}")
        

def saveCameraPing(key: str, count: int):
    try:
        now = datetime.now(timezone.utc)
        entry = {
            "key": key,
            "count": count,
            "time": now.isoformat()
        }
        supabase.table("raw_camera_logs").insert(entry).execute()
        print(f"✅ Ping salvat {key}")
    except Exception as e:
        print(f"❌ Eroare: {e}")


def readDataFromAWeekAgo(key: str):
    response = supabase.table("daily_queue_logs").select("*").eq("key", key).execute()
    
    if len(response.data) >= 7:
        last_seven_days = response.data[-7:]
        return last_seven_days
    else:
        return {
            "err": "Not found error",
            "msg": "No data from a week ago"
        }



def getHourlyAnalytics(key: str):
    response = supabase.table("hourly_queue_logs").select("*").eq("key", key).order("time", desc=True).execute()
    
    if response.data:
        return response.data
    return []

def readDailyAnalytics(key: str):
    response = supabase.table("daily_queue_logs").select("*").eq("key", key).execute()
    return response.data


def savePersonCount(key:str, count:int):
    supabase.table("user_keys").update({"count": count}).eq("key", key).execute()


def getDataFromPreviousDay(key: str, day: str):
    response = (
        supabase.table("daily_queue_logs").select("*").eq("key", key).eq("day", day).order("id", desc=True).limit(1).single().execute()
    )
    return response.data
 



def getInstitutionJSON(key: str):
    response = supabase.table("user_keys").select("*").eq("key", key).execute()
    
    if response.data:
        return response.data[0].get("data")
    return None