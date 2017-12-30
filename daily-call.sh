#!/bin/bash
START=$(date +%s)
THESIS_HOME="/root/project/MusicRecommendationSystem/"
CF_DIR=${THESIS_HOME}/SourceCode/Algorithms/CF/
CBF_DIR=${THESIS_HOME}/SourceCode/Algorithms/CBF/
POPULAR_DIR=${THESIS_HOME}/SourceCode/Algorithms/Popularity/

echo "*********************************************" >> ${THESIS_HOME}/log
source /root/miniconda2/bin/activate music-recommendation

START_POP=$(date +%s)
echo "Calculating popularity..." >> ${THESIS_HOME}/log
cd $POPULAR_DIR
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 main.py
END_POP=$(date +%s)
REPORT_POP=$(( $END_POP - $START_POP ))
echo "Calculating popularity completed." >> ${THESIS_HOME}/log

START_CF=$(date +%s)
echo "Calculating CF..." >> ${THESIS_HOME}/log
cd $CF_DIR
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 main.py
END_CF=$(date +%s)
REPORT_CF=$(( $END_CF - $START_CF ))
echo "Calculating CF completed." >> ${THESIS_HOME}/log

START_LYRICS=$(date +%s)
echo "Calculating lyrics similarity..." >> ${THESIS_HOME}/log
cd $CBF_DIR
python item_item_similarity.py
END_LYRICS=$(date +%s)
REPORT_LYRICS=$(( $END_LYRICS - $START_LYRICS ))
echo "Calculating lyrics similarity completed." >> ${THESIS_HOME}/log

START_BUILD_USER_PROFILE=$(date +%s)
echo "Calculating user profile..." >> ${THESIS_HOME}/log
python build_user_profile.py
END_BUILD_USER_PROFILE=$(date +%s)
REPORT_BUILD_USER_PROFILE=$(( $END_BUILD_USER_PROFILE - $START_BUILD_USER_PROFILE ))
echo "Calculating user profile completed." >> ${THESIS_HOME}/log

START_CBF=$(date +%s)
echo "Calculating CBF..." >> ${THESIS_HOME}/log
spark-submit --packages anguenot/pyspark-cassandra:0.7.0 user_item_similarity.py
END_CBF=$(date +%s)
REPORT_CBF=$(( $END_CBF - $START_CBF ))
echo "Calculating CBF completed." >> ${THESIS_HOME}/log

source /root/miniconda2/bin/deactivate

END=$(date +%s)
DIFF=$(( $END - $START ))
DATE=`date '+%Y-%m-%d %H:%M:%S'`

echo "${DATE} - took ${DIFF} seconds" >> ${THESIS_HOME}/log
echo "- Popularity: ${REPORT_POP} seconds" >> ${THESIS_HOME}/log
echo "- Collaborative: ${REPORT_CF} seconds" >> ${THESIS_HOME}/log
echo "- Lyrics Similarity: ${REPORT_LYRICS} seconds" >> ${THESIS_HOME}/log
echo "- Build User Profile: ${REPORT_BUILD_USER_PROFILE} seconds" >> ${THESIS_HOME}/log
echo "- Content-based: ${REPORT_CBF} seconds" >> ${THESIS_HOME}/log
