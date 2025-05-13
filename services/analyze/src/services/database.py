from prisma import Client
from src.patterns.singleton import SingletonMeta

class PrismaClient(metaclass=SingletonMeta):
    def __init__(self):
        self.db = Client()
        self.is_connected = False
        
    async def connect(self):
        if self.is_connected:
            return

        await self.db.connect()
        self.is_connected = True

    async def disconnect(self):
        if not self.is_connected:
            return
        
        await self.db.disconnect()
        self.is_connected = False

