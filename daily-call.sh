#!/bin/bash

THESIS_HOME="/root/project/MusicRecommendationSystem/"
CF_DIR=${THESIS_HOME}/SourceCode/Algorithms/CF/
POPULAR_DIR=${THESIS_HOME}/SourceCode/Algorithms/Popularity/

echo "Calculating popularity..."
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 POPULAR_DIR/main.py
echo "Calculating CF..."
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 CF_DIR/main.py

