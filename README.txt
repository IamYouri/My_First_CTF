Projet Application 3A 2023-2024
Membre du groupe : Bezzazi Morad , Ellabari Khalid , Guerram Yasser , Jerbi Dorra , Merzouk Youri , Oubani Mariame 
Chef de groupe : MEZROUK Youri
Projet pirate 4 
Faire un CTF : ENIGMA HOTEL 
lien du diapo : https://www.canva.com/design/DAGIsKrSP-8/E-UMXzgd1kAzPjjW-Te8iw/edit?utm_content=DAGIsKrSP-8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1- Les commandes pour installer le docker : 

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

2- modifiez le fichier web/ip.json en remplacant ipAddress par votre adresse IP

3- Les commandes pour créer les images des challenges : 
  cd challenges 
  chmod +x build_docker_image.sh
  ./build_docker_image.sh

4- Les commandes pour lancer le docker principal : 
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


