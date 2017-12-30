#!/bin/bash

THESIS_HOME="/root/project/MusicRecommendationSystem/"
CF_DIR=${THESIS_HOME}/SourceCode/Algorithms/CF/
CBF_DIR=${THESIS_HOME}/SourceCode/Algorithms/CBF/
POPULAR_DIR=${THESIS_HOME}/SourceCode/Algorithms/Popularity/

source activate music-recommendation

echo "Calculating popularity..."
cd $POPULAR_DIR
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 main.py

echo "Calculating CF..."
cd $CF_DIR
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 main.py

echo "Calculating lyrics similarity..."
cd $CBF_DIR
python item_item_similarity.py

echo "Calculating user profile..."
python build_user_profile.py

echo "Calculating CBF..."
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 main.py

source deactivate
