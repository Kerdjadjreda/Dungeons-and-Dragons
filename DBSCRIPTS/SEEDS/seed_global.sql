-- items
INSERT INTO items (item_name, item_category)
VALUES
('Pierre', 'divers'),
('Potion de soin', 'consommable'),
('Anneau de force', 'equipement');

-- utilisateurs test
INSERT INTO users (email, username, password)
VALUES
('test@test.com', 'jean', 'test'), ('pierre@gmail.com', 'pierre', 'test');

-- campagne test
INSERT INTO campaigns (camp_name, mode, creator_user_id, invite_code)
VALUES
('Campagne test', 'campagne en ligne', 1, 'TEST123');

-- membre campagne
INSERT INTO campaign_members (user_id, campaign_id, role)
VALUES
(1,1,'Maitre du jeu'), (2,1,'Joueur');