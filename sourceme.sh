#!/bin/bash

export CONDA_DIR=$(readlink -f ~/Softwares/miniconda3/bin/)
export THESIS_HOME=$(readlink -f ./)
export DATA_ARCHIVE=${THESIS_HOME}/DataArchive/
export CRAWLER_DIR=${THESIS_HOME}/SourceCode/Helpers/DataCrawler/
export EVENTGEN_DIR=${THESIS_HOME}/SourceCode/Helpers/EventsGenerator/
export USERGEN_DIR=${THESIS_HOME}/SourceCode/Helpers/FakeUserGenerator/
