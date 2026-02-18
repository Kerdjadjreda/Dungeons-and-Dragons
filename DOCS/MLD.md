# MLD

## users
users (**id**, email, username, password, created_at)

## campaigns
campaigns (**id**, name, mode, synopsis, creator_user_id, is_active, created_at) \
-FK creator_user_id = users(id)

## campaign_members
campaign_members (**PK (campaign_id, user_id)**, role, joined_at, user_id, campaign_id) \
-FK user_id = users(id) \
-FK campaign_id = campaigns(id)

## characters
characters (**id**, name, race, class, exp, hp, mana, gold, str, cons, dext, inte, wis, cha, is_dead, created_at, user_id, campaign_id) \
-FK user_id = users(id), \
-FK campaign_id = campaigns(id) \
-FK (campaign_id, user_id) = campaign_members(campaign_id, user_id)

## items
items (**id**, name, effect_type, effect_value)

## characters_items
characters_inventory (character_id, item_id, quantity, is_equipped)

## monster_templates
monster_template(**id**, name, cr, type, source, stat_block)

## combat_sessions
combat_sessions(**id**, title, is_active, started_at, ended_at, round_number, campaign_id) \
-FK campaign_id = campaigns(id)

## instanced_entity
instanced_entity(**id**, entity_type, hp_max, current_hp, initiative, position, is_dead, gold_delta, exp_delta, monsters_template_id, characters_id, combat_sessions_id) \
-FK combat_session_id = combat_session(id) \
-FK character_id = character(id) \
-FK monster_template_id = monster_template(id)\
- Rule: exactly one of (character_id, monster_template_id) must be set (depending on entity_type)


## entity_effects
entity_effects(**id**, name, buff_debuff, stat, modifier, rounds_remaining, instanced_entity_id)\
-FK instanced_entity_id = instanced_entity(id)