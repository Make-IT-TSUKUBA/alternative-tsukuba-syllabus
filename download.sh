#!/usr/bin/env bash

# set -euo pipefail
# IFS=$'\n\t'

# Get present nendo (fiscal year: https://en.wikipedia.org/wiki/Fiscal_year)
function _get_nendo() {
  if [[ "$(date +%m)" =~ 0[1-3] ]]; then
    date +%Y -d "1 year ago"
  else
    date +%Y
  fi
}

# Get the file name of the latest syllabus data
function _get_latest_csv() {
  curl -s -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/${ALTKDB_REPO}/git/trees/main?recursive=1" |
    tac | grep -m1 '"path": .*/csv/kdb-.*csv"' | awk -F '"' '$0=$4'
}

# Obtaining a list of subject codes from the latest syllabus data
function _get_code_list() {
  local latest_csv nendo

  latest_csv="$(_get_latest_csv)"
  echo -e "[latest]: ${latest_csv}" >&2

  nendo="$(_get_nendo)"
  echo -e "[nendo]: ${nendo}" >&2
  # Archive data of previous year
  if ! [ -d "${DEST}/$((nendo-1))" ]; then
    mkdir "${DEST}/$((nendo-1))"
    mv "${DEST}"/*.html "${DEST}/$((nendo-1))"
  fi

  echo "[urls]:" >&2
  curl -sL "https://github.com/${ALTKDB_REPO}/raw/main/${latest_csv}" |
    awk -F '[,"]' 'NR > 1 && $2 != "" {
      print "https://kdb.tsukuba.ac.jp/syllabi/"y"/"$2"/jpn/"
    }' y="$nendo"
}

# Download pages of urls given from stdin urls to a spesific dir
function _download() {
  local url class_code i
  i=0
  while read -r url; do
    class_code="${url:39:7}"
    echo -n "[$((++i))]: ${url}"
    if [ -n "$class_code" ] &&
      wget -O "${DEST}/${class_code}.html" \
        --cipher 'DEFAULT:!DH' -q \
        -w 3 --random-wait "$url"; then
      echo " =>OK"
    else
      echo " =>NG"
    fi
  done
}

function main() {
  readonly ALTKDB_REPO="Make-IT-TSUKUBA/alternative-tsukuba-kdb"
  readonly DEST="${1-syllabus}"
  mkdir -p "$DEST"
  _get_code_list | _download
}

main "$@"
exit "$?"
