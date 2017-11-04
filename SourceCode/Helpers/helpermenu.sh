#!/bin/bash

echo "-----------Helper Menu-----------"

# Check if the sourceme.sh is run before.
if [[ -z "${CONDA_DIR}" ]] || [[ -z "${CONDA_DIR}" ]] || [[ -z "${CONDA_DIR}" ]]; then
	echo "Please source sourceme.sh before run this script."
	exit 1
fi

echo "1. Crawl music data."
echo "2. Genrate fake users."
echo "3. Generate user event."
echo "4. Import metadata."

# Get user input
echo -n "> "
read option

spider_name="mp3"

if [ $option == "1" ]; then
        rm -f ${DATA_ARCHIVE}/metadata.csv
        source ${CONDA_DIR}/activate webcrawler
        pushd $CRAWLER_DIR
        scrapy crawl mp3 -o ${DATA_ARCHIVE}/metadata.csv -t csv
        popd
        source ${CONDA_DIR}/deactivate
        echo "Completed!"
        exit 0
fi

if [ $option == "2" ]; then 
        rm -f ${DATA_ARCHIVE}/user.csv
        python ${USERGEN_DIR}/fake_user_maker.py
        echo "Completed!"
        exit 0
fi

if [ $option == "3" ]; then 
	rm -f ${DATA_ARCHIVE}/user_event.csv
	python ${EVENTGEN_DIR}/UserEventMaker.py
        echo "Completed!"
        exit 0
fi

if [ $option == "4" ]; then 
        echo "Importing metatdata.csv into Cassandra... Please be patient!"
	python ${IMPORTCAS_DIR}/main.py
        echo "Completed!"
        exit 0
fi

echo "Input is invalid"
exit 1
