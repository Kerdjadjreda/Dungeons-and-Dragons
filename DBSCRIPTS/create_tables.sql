--transaction pour m'assurer que toutes mes tables passent.
BEGIN;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaigns (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    camp_name TEXT NOT NULL,
    mode TEXT NOT NULL,
    synopsis TEXT,
    creator_user_id BIGINT NOT NULL REFERENCES users(id),
    invite_code TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaign_members (
    role TEXT NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    user_id BIGINT NOT NULL,
    campaign_id BIGINT NOT NULL,

    PRIMARY KEY (campaign_id, user_id),

    FOREIGN KEY (campaign_id)
    REFERENCES campaigns(id)
    ON DELETE CASCADE,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE characters (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    campaign_id BIGINT NOT NULL,

    char_name TEXT NOT NULL,
    race TEXT NOT NULL,
    char_class TEXT NOT NULL,

    exp INT NOT NULL DEFAULT 0,
    hp INT NOT NULL,
    mana INT NOT NULL DEFAULT 0,
    gold BIGINT NOT NULL DEFAULT 0,

    strength INT NOT NULL,
    constitution INT NOT NULL,
    dexterity INT NOT NULL,
    intelligence INT NOT NULL,
    wisdom INT NOT NULL,
    charisma INT NOT NULL,

    is_dead BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),


    FOREIGN KEY(user_id)
    REFERENCES users(id),

    FOREIGN KEY (campaign_id)
    REFERENCES campaigns(id),

    FOREIGN KEY (campaign_id, user_id)
    REFERENCES campaign_members(campaign_id, user_id)
);

CREATE UNIQUE INDEX uniq_alive_char_name_per_campaign
ON characters (campaign_id, char_name)
WHERE is_dead = false;

CREATE TABLE items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    item_name TEXT NOT NULL,
    effect_type TEXT NOT NULL,
    effect_value INT NOT NULL
);

CREATE TABLE characters_items (
    character_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,

    quantity BIGINT NOT NULL DEFAULT 0,
    is_equipped BOOLEAN NOT NULL DEFAULT false,
    
    PRIMARY KEY (character_id, item_id),

    FOREIGN KEY (character_id)
    REFERENCES characters(id),

    FOREIGN KEY (item_id)
    REFERENCES items(id)
);

CREATE TABLE monster_templates (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    monster_name TEXT NOT NULL,
    challenge_rating NUMERIC(4,2) NOT NULL DEFAULT 0,
    monster_type TEXT NOT NULL,
    source TEXT NOT NULL,
    stat_block JSONB NOT NULL
);
CREATE INDEX idx_monster_templates_name
ON monster_templates(monster_name);

CREATE TABLE combat_sessions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    campaign_id BIGINT NOT NULL,

    title TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ NULL,
    round_number INT NOT NULL DEFAULT 0,

    FOREIGN KEY (campaign_id) 
    REFERENCES campaigns(id)
);

CREATE TABLE instanced_entity (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    
    combat_session_id BIGINT NOT NULL,
    character_id BIGINT NULL,
    monster_template_id BIGINT NULL,

    entity_type TEXT NOT NULL,
    hp_max INT NOT NULL,
    current_hp INT NOT NULL,
    initiative INT NOT NULL,
    position INT NOT NULL,
    is_dead BOOLEAN NOT NULL DEFAULT false,

    gold_delta INT NOT NULL DEFAULT 0,
    exp_delta INT NOT NULL DEFAULT 0,

    FOREIGN KEY (character_id)
    REFERENCES characters(id),

    FOREIGN KEY (combat_session_id)
    REFERENCES combat_sessions(id),

    FOREIGN KEY (monster_template_id)
    REFERENCES monster_templates(id),

    CONSTRAINT chk_entity_type_match
    CHECK (
        (entity_type = 'character' AND character_id IS NOT NULL AND monster_template_id IS NULL)
        OR
        (entity_type = 'monster' AND monster_template_id IS NOT NULL AND character_id IS NULL)
    )
);

CREATE TABLE entity_effects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    instanced_entity_id BIGINT NOT NULL,

    effect_name TEXT NOT NULL,
    buff_debuff INT NOT NULL DEFAULT 0,
    stat TEXT NOT NULL,
    modifier INT NOT NULL DEFAULT 0,
    rounds_remaining INT NOT NULL DEFAULT 0,
    
    FOREIGN KEY (instanced_entity_id)
    REFERENCES instanced_entity(id)
);

COMMIT;