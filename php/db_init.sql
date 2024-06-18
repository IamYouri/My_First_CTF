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
