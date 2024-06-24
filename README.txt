Projet Application 3A 2023-2024
Membre du groupe : Bezzazi Morad , Ellabari Khalid , Guerram Yasser , Jerbi Dorra , Merzouk Youri , Oubani Mariame 
Chef de groupe : MEZROUK Youri
Projet pirate 4 
Faire un CTF : ENIGMA HOTEL 
lien du diapo : https://www.canva.com/design/DAGIsKrSP-8/E-UMXzgd1kAzPjjW-Te8iw/edit?utm_content=DAGIsKrSP-8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Les commandes pour installer le docker : 

sudo apt update
sudo apt upgrade
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce
sudo usermod -aG docker $USER
sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

Les commandes pour créer les images des challenges : 
cd os/challenges 
chmod +x build_docker_image.sh
./build_docker_image.sh

Les commandes pour lancer le docker principal : 
cd web
sudo docker-compose up --build



Pour les challenges : 
  -Pour les challenges réseau : 
Il faut avoir Python sur la machine 
Il faut avoir wireshark ou tshark pour ouvrir les captures 
  -Pour les challenges web : 
Il faut utiliser les outils de développement pour résoudre les challenges 
  -Pour les challenges système : 
On a besoin d'une machine Kali Linux 


Pour la partie FrontEnd : 

I.	Base de donnée : PSQL
-	sudo apt update
-	sudo apt install postgresql postgresql-contrib
-	sudo -i -u postgres
-	psql
-	CREATE DATABASE hotel_enigma; (création de la base de donnée, ici la base de donnée est nommée hotel_enigma)
-	\c hotel_enigma (on se connecte à la base de donnée créée).
On commence maintenant à créer les tables ou les relations de la base de donnée hotel_enigma : 

•	CREATE TABLE t_user_usr (
    usr_pseudo VARCHAR(255) PRIMARY KEY,
    usr_first_name VARCHAR(255) NOT NULL,
    usr_last_name VARCHAR(255) NOT NULL,
    usr_password VARCHAR(255) NOT NULL,
    usr_email VARCHAR(255) NOT NULL UNIQUE,
    user_id SERIAL UNIQUE
);
=>Cette table concerne toutes les informations sur l’utilisateur.
•	CREATE TABLE t_CTF_ctf (
             ctf_id SERIAL PRIMARY KEY,
             ctf_title VARCHAR(255) NOT NULL,
             ctf_description TEXT NOT NULL,
             ctf_difficulty VARCHAR(50) NOT NULL,
             ctf_solution TEXT NOT NULL,
             ctf_score INT NOT NULL,
             ctf_floor INT NOT NULL
          );
=>Cette table concerne toutes les informations sur les CTFs.

•	CREATE TABLE t_resolved_rsv (
    rsv_id SERIAL PRIMARY KEY,
    usr_id VARCHAR(255) NOT NULL,
    ctf_id INT NOT NULL,
    FOREIGN KEY (usr_id) REFERENCES t_user_usr (usr_pseudo),
    FOREIGN KEY (ctf_id) REFERENCES t_CTF_ctf (ctf_id)
);
=>Cette table permet de liée la table t_user_usr et t_CTF_ctf.

•	CREATE TABLE session (
    sid VARCHAR PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL
);
=>Cette table concerne les informations des sessions pour la connexion des utilisateurs.

II.	Démarrage du server (NodeJs) :
-	sudo apt update
-	sudo apt install nodejs
-	sudo apt install npm
-	node –v
-	npm –v
Installation des packages utilisées dans le serveur : 
-	npm install express
-	npm install cors
-	npm install body-parser
-	npm install bcryptjs
-	npm install pg
-	npm install path
-	npm install express-session
-	npm install cookie-parser
-	npm install connect-pg-simple
Lancement du serveur: 
-	node server.js (on remplace server.js par le nom du fichier du serveur)
•	On lance le serveur avec la commande : node server.js (dans un terminal à part)
•	Sur firefox, on se connecte à localhost:3000 (nous on a choisi le port 3000)
•	Concernant la partie register (s’inscrire), après avoir rempli les champs et en appuyant sur « submit », vous devez avoir une erreur d’inscription, ce qui est logique car il y’a un password dans la base de donnée qui est « password » présent dans le serveur. Pour résoudre cela, on ouvre un nouveau terminal et on tape les commandes suivantes :
•	- sudo -i -u postgres
•	- psql
•	ALTER USER postgres PASSWORD ‘password’ ;
Vous redémarrer le serveur bien sûr (node server.js), puis vous vous reconnectez, et tout fonctionnera correctement !


