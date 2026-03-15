from Server.database.client import supabase


def calculateAvgWaitTime(count:int, type:int, counters:int):
    match type:
        case 1:
            return (15 * count) / counters
        case 2:
            return (12 * count) / counters
        case 3:
            return (10 * count) / counters
        case 4:
            return (8 * count) / counters
        case 5:
            return (12 * count) / counters
        case 6:
            return (4 * count) / counters
        case 7:
            return (13 * count) / counters
        case 8:
            return (11 * count) / counters
        
        
        

