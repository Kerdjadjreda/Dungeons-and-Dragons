# je mets un chemin relatif pour éviter les erreurs de path
cd "$(dirname "$0")"

# j'importe mon .env pour utiliser les variables
source ../.env

# je me connecte en super utilisateur
export PGUSER=postgres
export PGDATABASE=postgres

# je supprime la db et l'utilisateur s'ils existent
dropdb --if-exists "$DB_NAME"
dropuser --if-exists "$DB_ADMIN"


# je passe les valeurs dynamiquement au sql
psql -v DB_NAME="$DB_NAME" -v DB_ADMIN="$DB_ADMIN" -v DB_PASSWORD="$DB_PASSWORD" -f ./init_db.sql

# je me log en admin de ma bdd
export PGUSER="$DB_ADMIN"
export PGPASSWORD="$DB_PASSWORD"
export PGDATABASE="$DB_NAME"

# et j'execute tout simplement mon script qui va créer mes tables
psql -f ./create_tables.sql