INSERT INTO monster_templates
(monster_name, challenge_rating, monster_type, source, stat_block)
VALUES

-- Goblin
(
  'Goblin',
  0.25,
  'humanoid',
  'Monster Manual',
  '{
    "armor_class": 15,
    "hit_points": 7,
    "speed": 30,
    "stats": {
      "strength": 8,
      "dexterity": 14,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 8,
      "charisma": 8
    },
    "abilities": [
      "Nimble Escape"
    ]
  }'
),

-- Orc
(
  'Orc',
  0.5,
  'humanoid',
  'Monster Manual',
  '{
    "armor_class": 13,
    "hit_points": 15,
    "speed": 30,
    "stats": {
      "strength": 16,
      "dexterity": 12,
      "constitution": 16,
      "intelligence": 7,
      "wisdom": 11,
      "charisma": 10
    },
    "abilities": [
      "Aggressive"
    ]
  }'
),

-- Skeleton
(
  'Skeleton',
  0.25,
  'undead',
  'Monster Manual',
  '{
    "armor_class": 13,
    "hit_points": 13,
    "speed": 30,
    "stats": {
      "strength": 10,
      "dexterity": 14,
      "constitution": 15,
      "intelligence": 6,
      "wisdom": 8,
      "charisma": 5
    },
    "immunities": [
      "poison"
    ]
  }'
),

-- Young Red Dragon
(
  'Young Red Dragon',
  10.0,
  'dragon',
  'Monster Manual',
  '{
    "armor_class": 18,
    "hit_points": 178,
    "speed": 40,
    "fly_speed": 80,
    "stats": {
      "strength": 23,
      "dexterity": 10,
      "constitution": 21,
      "intelligence": 14,
      "wisdom": 11,
      "charisma": 19
    },
    "resistances": [
      "fire"
    ],
    "abilities": [
      "Fire Breath"
    ]
  }'
);