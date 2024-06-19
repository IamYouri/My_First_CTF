#!/bin/bash

sudo docker build -t challenge_image_1 ./Network/lvl1
sudo docker build -t challenge_image_2 ./Network/lvl2
sudo docker build -t challenge_image_3 ./Network/lvl3
sudo docker build -t challenge_image_4 ./Network/lvl4
sudo docker build -t challenge_image_5 ./Network/lvl5

sudo docker build -t challenge_image_6 ./system/lvl1
sudo docker build -t challenge_image_7 ./system/lvl2
sudo docker build -t challenge_image_8 ./system/lvl3
sudo docker build -t challenge_image_9 ./system/lvl4
# sudo docker build -t challenge_image_10 ./system/lvl5

# sudo docker build -t challenge_image_11 ./web/lvl1
# sudo docker build -t challenge_image_12 ./web/lvl2
# sudo docker build -t challenge_image_13 ./web/lvl3
# sudo docker build -t challenge_image_14 ./web/lvl4
# sudo docker build -t challenge_image_15 ./web/lvl5
