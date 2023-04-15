#!/usr/bin/env bash

set -x

echo "[$(date)] Start benchmark for Uniswap/v3-core"
# environment variables
# PROJECT_ID
# X_API_KEY

BACKEND_URL="https://app.fuzzy.fyi"

TEST_NAMES=(
  TickBitmapEchidnaTest 
  TickMathEchidnaTest
  SqrtPriceMathEchidnaTest
  SwapMathEchidnaTest
  TickEchidnaTest
  TickOverflowSafetyEchidnaTest
  OracleEchidnaTest
  BitMathEchidnaTest
  LowGasSafeMathEchidnaTest
  UnsafeMathEchidnaTest
  FullMathEchidnaTest
)
TEST_LIMITS=(
  "1000"
  "10000"
  "100000"
)
INSTANCE_TYPES=(
  "t3.large"
  "m5.large"
  "c5.large"
)
for INSTANCE_TYPE in ${INSTANCE_TYPES[@]}; do
  for TEST_LIMIT in ${TEST_LIMITS[@]}; do
    for TEST_NAME in ${TEST_NAMES[@]}; do
      echo "$INSTANCE_TYPE-$TEST_LIMIT-$TEST_NAME"
      CMD="yarn install --frozen-lockfile && solc-select install 0.7.6 && solc-select use 0.7.6 && echidna . --contract $TEST_NAME --test-mode assertion --corpus-dir echidna --test-limit $TEST_LIMIT"

      curl -XPOST -H 'Content-Type: application/json' -H "x-api-key: $X_API_KEY" \
        --data "{\"projectId\":\"$PROJECT_ID\",\"ref\":\"main\",\"cmd\":\"$CMD\",\"instanceType\":\"$INSTANCE_TYPE\"}" "$BACKEND_URL/api/job"
    done
  done
done


echo "[$(date)] Finish benchmark"