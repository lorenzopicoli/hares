# Hares

To serve app and a sync database:
```
sudo docker compose -f docker-compose.full.yml up -d
```

To serve just the sync database:
```
sudo docker compose -f docker-compose.db.yml up -d
```

To serve just the app (offline only mode):
```
sudo docker compose -f docker-compose.app.yml up -d
```