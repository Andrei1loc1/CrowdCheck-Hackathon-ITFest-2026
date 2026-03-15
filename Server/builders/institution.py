class location:
    institutionId : str
    name: str
    city: str
    personCount :int
    institutionType : int
    avgWaitTime: int
    
    
    def __init__(self, institutionId:str, name:str, city:str, personCount:int, institutionType: int, avgWaitTime:int):
        self.institutionId = institutionId
        self.name = name
        self.city = city
        self.personCount = personCount
        self.institutionType = institutionType
        self.avgWaitTime = avgWaitTime
        
    