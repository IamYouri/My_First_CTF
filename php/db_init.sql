CREATE TABLE t_user_usr (
    usr_pseudo VARCHAR(255) PRIMARY KEY,
    usr_first_name VARCHAR(255) NOT NULL,
    usr_last_name VARCHAR(255) NOT NULL,
    usr_password VARCHAR(255) NOT NULL,
    usr_email VARCHAR(255) NOT NULL UNIQUE
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


-- Insérer des utilisateurs
INSERT INTO t_user_usr (usr_pseudo, usr_first_name, usr_last_name, usr_password, usr_email) VALUES
('jdoe', 'John', 'Doe', '$2a$10$7fDWc9cFl7Dbzj3Uq9J9MeO8i8.DhGd7j/erzkNO/d6zRm.3TAWnK', 'jdoe@example.com'),
('asmith', 'Alice', 'Smith', '$2a$10$7fDWc9cFl7Dbzj3Uq9J9MeO8i8.DhGd7j/erzkNO/d6zRm.3TAWnK', 'asmith@example.com');

-- Insérer des CTFs
INSERT INTO t_CTF_ctf  VALUES
(1,'Basic Challenge', 'Solve this simple challenge.', 'Easy', 'flag{basic_flag}', 100, 1),
(2,'Intermediate Challenge', 'Solve this intermediate challenge.', 'Medium', 'flag{intermediate_flag}', 200, 2),
(3,'Advanced Challenge', 'Solve this advanced challenge.', 'Hard', 'flag{advanced_flag}', 300, 3);

-- Insérer des résolutions
INSERT INTO t_resolved_rsv (usr_id, ctf_id) VALUES
('jdoe', 1),
('asmith', 2);