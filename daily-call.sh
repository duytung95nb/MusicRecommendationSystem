#!/bin/bash
START=$(date +%s)

THESIS_HOME="/root/project/MusicRecommendationSystem/"
CF_DIR=${THESIS_HOME}/SourceCode/Algorithms/CF/
CBF_DIR=${THESIS_HOME}/SourceCode/Algorithms/CBF/
POPULAR_DIR=${THESIS_HOME}/SourceCode/Algorithms/Popularity/

source activate music-recommendation

START_POP=$(date +%s)
echo "Calculating popularity..."
cd $POPULAR_DIR
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 main.py
END_POP=$(date +%s)
REPORT_POP=$(( $END_POP - $START_POP ))

START_CF=$(date +%s)
echo "Calculating CF..."
cd $CF_DIR
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 main.py
END_CF=$(date +%s)
REPORT_CF=$(( $END_CF - $START_CF ))

START_LYRICS=$(date +%s)
echo "Calculating lyrics similarity..."
cd $CBF_DIR
python item_item_similarity.py
END_LYRICS=$(date +%s)
REPORT_LYRICS=$(( $END_LYRICS - $START_LYRICS ))

START_BUILD_USER_PROFILE=$(date +%s)
echo "Calculating user profile..."
python build_user_profile.py
END_BUILD_USER_PROFILE=$(date +%s)
REPORT_BUILD_USER_PROFILE=$(( $END_BUILD_USER_PROFILE - $START_BUILD_USER_PROFILE ))

START_CBF=$(date +%s)
echo "Calculating CBF..."
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 user_item_similarity.py
END_CBF=$(date +%s)
REPORT_CBF=$(( $END_CBF - $START_CBF ))

source deactivate

END=$(date +%s)
DIFF=$(( $END - $START ))
DATE=`date '+%Y-%m-%d %H:%M:%S'`
echo "${DATE} - took ${DIFF} seconds" >> ${THESIS_HOME}/log
echo "\t- Popularity: ${REPORT_POP} seconds" >> ${THESIS_HOME}/log
echo "\t- Collaborative: ${REPORT_CF} seconds" >> ${THESIS_HOME}/log
echo "\t- Lyrics Similarity: ${REPORT_LYRICS} seconds" >> ${THESIS_HOME}/log
echo "\t- Build User Profile: ${REPORT_BUILD_USER_PROFILE} seconds" >> ${THESIS_HOME}/log
echo "\t- Content-based: ${REPORT_CBF} seconds" >> ${THESIS_HOME}/log
