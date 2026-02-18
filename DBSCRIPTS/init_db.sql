
-- je crée mon rôle et ma bdd sans oublier de mettre db_admin responsable de ma bdd.

CREATE ROLE :"DB_ADMIN" WITH LOGIN PASSWORD :'DB_PASSWORD';
CREATE DATABASE :"DB_NAME" OWNER :"DB_ADMIN";