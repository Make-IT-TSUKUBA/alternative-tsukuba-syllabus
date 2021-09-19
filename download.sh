#!/usr/bin/env -S bash -e

readonly ALTKDB_REPO="Make-IT-TSUKUBA/alternative-tsukuba-kdb"

# Get the file name of the latest syllabus data.
function _get_latest_csv() {
  curl -s -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/${ALTKDB_REPO}/git/trees/master?recursive=1" |
    tac | grep -oPm1 '(?<="path": ")csv/[^"]+\.csv'
}

# Obtaining a list of subject codes from the latest syllabus data.
function _get_code_list() {
  local LATEST_CSV YEAR
  readonly LATEST_CSV="$(_get_latest_csv)"
  readonly YEAR="${LATEST_CSV:8:4}"
  echo -e "[latest]:\n${LATEST_CSV}\n[year]:\n${YEAR}">&2
  echo "[urls]:">&2
  curl -sL "https://github.com/${ALTKDB_REPO}/raw/master/${LATEST_CSV}" |
  awk -F'[,"]' 'NR>1&&$2!=""{print"https://kdb.tsukuba.ac.jp/syllabi/"y"/"$2"/jpn/"}' y="$YEAR"
}

# Download stdin urls to received from optional cmdarg.
function _download() {
  local DEST url class_code
  readonly DEST="${1-syllabus}"
  mkdir -p "$DEST"
  while read -r url; do
    class_code="${url:39:7}"
    echo -n "[$((++i))]: ${url}"
    [ -n "$class_code" ] \
      && wget -O "${DEST}/${class_code}.html" \
              --cipher 'DEFAULT:!DH' -q \
              -w 3 --random-wait \
              "$url" && echo "=>OK" || echo "=>NG"
  done
}

# Main.
function main() {
  _get_code_list | _download
}

main "$@"
exit "$?"
