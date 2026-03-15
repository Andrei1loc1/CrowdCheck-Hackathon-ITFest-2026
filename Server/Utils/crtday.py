import pytz
from datetime import datetime

def getDay():
    utc_now = datetime.now(pytz.utc)
    romania_tz = pytz.timezone("Europe/Bucharest")
    romania_now = utc_now.astimezone(romania_tz)
    return romania_now.strftime("%A")