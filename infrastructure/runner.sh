#!/usr/bin/env bash

set -ux

echo "[$(date)] Start runner"

echo "[$(date)] Setup variables"
INSTANCE_ID=$(wget -q -O - http://instance-data/latest/meta-data/instance-id)
BACKEND_URL="https://app.fuzzy.fyi"
WORKDIR=/home/ubuntu
ECHIDNA_DIRECTORY=echidna

echo "[$(date)] Go to working directory"
cd $WORKDIR

echo "[$(date)] Fetch job"
JOB=$(curl "$BACKEND_URL/api/job/instance/$INSTANCE_ID")
JOB_ID=$(echo $JOB | jq --raw-output '.id')
S3_BUCKET=$(echo $JOB | jq --raw-output '.aws.s3.bucket')

echo "[$(date)] Clone project"
PROJECT_GIT_URL=$(echo $JOB | jq --raw-output '.project.url')
JOB_REF=$(echo $JOB | jq --raw-output '.ref')
git clone "$PROJECT_GIT_URL"
cd "$(basename "$PROJECT_GIT_URL" .git)"
git checkout "$JOB_REF"

echo "[$(date)] Load previous output from S3"
aws s3 sync s3://$S3_BUCKET/job/$JOB_ID/ .

echo "[$(date)] Run command"
JOB_CMD=$(echo $JOB | jq --raw-output '.cmd')
curl -XPATCH --data '{"status":"RUNNING"}' "$BACKEND_URL/api/job/$JOB_ID"
echo "[$(date)] '$JOB_CMD'"
eval $JOB_CMD | tee logs.txt

echo "[$(date)] Copy output to S3"
aws s3 cp logs.txt s3://$S3_BUCKET/job/$JOB_ID/
aws s3 sync $ECHIDNA_DIRECTORY/ s3://$S3_BUCKET/job/$JOB_ID/
curl -XPATCH --data '{"status":"FINISHED"}' "$BACKEND_URL/api/job/$JOB_ID"

echo "[$(date)] Finish job"
curl -XDELETE "$BACKEND_URL/api/job/$JOB_ID"