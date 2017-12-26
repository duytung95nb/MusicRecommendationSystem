#!/bin/bash

THESIS_HOME="/root/project/MusicRecommendationSystem/"
CF_DIR=${THESIS_HOME}/SourceCode/Algorithms/CF/
POPULAR_DIR=${THESIS_HOME}/SourceCode/Algorithms/Popularity/

echo "Calculating popularity..."
cd $POPULAR_DIR
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 main.py

echo "Calculating CF..."
cd $CF_DIR
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 main.py

