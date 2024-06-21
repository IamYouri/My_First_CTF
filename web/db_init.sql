
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

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_1', 'Description de ctf_1', 'Facile', 'solution1', 10, 1);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_2', 'Description de ctf_2', 'Moyen', 'solution2', 20, 1);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_3', 'Description de ctf_3', 'Difficile', 'solution3', 30, 1);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_4', 'Description de ctf_4', 'Facile', 'solution4', 10, 2);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_5', 'Description de ctf_5', 'Moyen', 'solution5', 20, 2);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_6', 'Description de ctf_6', 'Difficile', 'solution6', 30, 2);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_7', 'Description de ctf_7', 'Facile', 'solution7', 10, 3);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_8', 'Description de ctf_8', 'Moyen', 'solution8', 20, 3);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_9', 'Description de ctf_9', 'Difficile', 'solution9', 30, 3);




INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_10', 'Description de ctf_10', 'Facile', 'solution10', 10, 4);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_11', 'Description de ctf_11', 'Moyen', 'solution11', 20, 4);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_12', 'Description de ctf_12', 'Difficile', 'solution12', 30, 4);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_13', 'Description de ctf_13', 'Facile', 'solution13', 10, 5);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_14', 'Description de ctf_14', 'Moyen', 'solution14', 20, 5);

INSERT INTO t_ctf_ctf (ctf_title, ctf_description, ctf_difficulty, ctf_solution, ctf_score, ctf_floor)
VALUES ('ctf_15', 'Description de ctf_15', 'Difficile', 'solution15', 30, 5);
