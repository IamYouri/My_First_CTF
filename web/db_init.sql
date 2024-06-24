
CREATE TABLE t_user_usr (
    usr_pseudo VARCHAR(255) PRIMARY KEY,
    usr_first_name VARCHAR(255) NOT NULL,
    usr_last_name VARCHAR(255) NOT NULL,
    usr_password VARCHAR(255) NOT NULL,
    usr_email VARCHAR(255) NOT NULL UNIQUE,
    user_id SERIAL UNIQUE
);


CREATE TABLE t_CTF_ctf (
    ctf_id SERIAL PRIMARY KEY,
    ctf_title VARCHAR(255) NOT NULL,
    ctf_description TEXT NOT NULL,
    ctf_difficulty VARCHAR(50) NOT NULL,
    ctf_solution TEXT NOT NULL,
    ctf_score INT NOT NULL,
    ctf_floor INT NOT NULL
);

CREATE TABLE t_resolved_rsv (
    rsv_id SERIAL PRIMARY KEY,
    usr_id VARCHAR(255) NOT NULL,
    ctf_id INT NOT NULL,
    FOREIGN KEY (usr_id) REFERENCES t_user_usr (usr_pseudo),
    FOREIGN KEY (ctf_id) REFERENCES t_CTF_ctf (ctf_id)
);

CREATE TABLE session (
    sid VARCHAR PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE TABLE user_containers ( 
    id SERIAL PRIMARY KEY, 
    user_id INTEGER NOT NULL, 
    container_id VARCHAR(255) NOT NULL, 
    start_time TIMESTAMP NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES t_user_usr(user_id) );
INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_1', 'Description de ctf_1', 'Facile', 'Sup3RStaR', 10, 1);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_2', 'Description de ctf_2', 'Moyen', '32', 20, 1);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_3', 'Description de ctf_3', 'Difficile', 'CTF{P13D_D3_81CH3}', 30, 1);
 
INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_4', 'Description de ctf_4', 'Facile', '130424', 10, 2);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_5', 'Description de ctf_5', 'Moyen', 'cdts3500', 20, 2);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_6', 'Description de ctf_6', 'Difficile', 'CTF{CutRedWire}', 30, 2);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_7', 'Description de ctf_7', 'Facile', 'CTF{challenge_5_flag}', 10, 3);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_8', 'Description de ctf_8', 'Moyen', 'ctf{HTTP_31337}', 20, 3);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_9', 'Description de ctf_9', 'Difficile', 'Welcome to the dark side!', 30, 3);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_10', 'Description de ctf_10', 'Facile', 'CTF{SGlCYXJiaWU=}', 10, 4);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_11', 'Description de ctf_11', 'Moyen', 'WelcomeToLAAamRchayed', 20, 4);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_12', 'Description de ctf_12', 'Difficile', 'canavaro', 30, 4);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_13', 'Description de ctf_13', 'Facile', 'CTF{csrf_success}', 10, 5);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_14', 'Description de ctf_14', 'Moyen', 'iloveyou', 20, 5);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_15', 'Description de ctf_15', 'Difficile', 'CTF{JACKPOT}', 30, 5);

















