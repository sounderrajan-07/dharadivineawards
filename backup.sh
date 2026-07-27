#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/dhara-db"
MONGO_URI="mongodb+srv://soundhers38_db_user:MbGcn2fyLnReShxx@cluster0.yripibj.mongodb.net/dhara_db?retryWrites=true&w=majority&appName=Cluster0"
DB_JSON_SRC="/var/www/dhara-divine-awards/data/db.json"

# Fixed single backup file targets (overwritten daily)
MONGO_BACKUP_FILE="$BACKUP_DIR/latest_mongo_backup.gz"
JSON_BACKUP_FILE="$BACKUP_DIR/latest_db_backup.json"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Updating single daily database backup files..."

# 1. Update single MongoDB Atlas backup file
if command -v mongodump &> /dev/null; then
    mongodump --uri="$MONGO_URI" --archive="$MONGO_BACKUP_FILE" --gzip
    echo "[$(date)] MongoDB database updated at $MONGO_BACKUP_FILE"
else
    echo "[$(date)] mongodump command not found."
fi

# 2. Update single local db.json backup file
if [ -f "$DB_JSON_SRC" ]; then
    cp "$DB_JSON_SRC" "$JSON_BACKUP_FILE"
    echo "[$(date)] Local db.json backup updated at $JSON_BACKUP_FILE"
fi

echo "[$(date)] Single daily backup update completed successfully."
