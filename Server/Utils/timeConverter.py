def formatTime(total_minutes):
    hours = total_minutes // 60  
    minutes = total_minutes % 60 
    
    if hours > 0:
        return f"{hours}h {minutes}min"
    else:
        return f"{minutes}min"

