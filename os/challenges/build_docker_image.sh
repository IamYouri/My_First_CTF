#!/bin/bash

sudo docker build -t challenge_image_1 ./web/lvl1
sudo docker build -t challenge_image_4 ./web/lvl2
sudo docker build -t challenge_image_7 ./web/lvl3
sudo docker build -t challenge_image_10 ./web/lvl4
sudo docker build -t challenge_image_13 ./web/lvl5

sudo docker build -t challenge_image_2 ./Network/lvl1
sudo docker build -t challenge_image_5 ./Network/lvl2
sudo docker build -t challenge_image_8 ./Network/lvl3
sudo docker build -t challenge_image_11 ./Network/lvl4
sudo docker build -t challenge_image_14 ./Network/lvl5

sudo docker build -t challenge_image_3 ./system/lvl1
sudo docker build -t challenge_image_6 ./system/lvl2
sudo docker build -t challenge_image_9 ./system/lvl3
sudo docker build -t challenge_image_12 ./system/lvl4
sudo docker build -t challenge_image_15 ./system/lvl5
          