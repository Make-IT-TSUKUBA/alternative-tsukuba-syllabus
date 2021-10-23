#!/usr/bin/env -S bash -e

# Get the file name of the latest syllabus data.
function _get_latest_csv() {
  curl -s -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/${ALTKDB_REPO}/git/trees/master?recursive=1" |
    tac | grep -m1 '"path": .*/csv/kdb-.*csv"' | awk -F '"' '$0=$4'
}

# Obtaining a list of subject codes from the latest syllabus data.
function _get_code_list() {
  local latest_csv year

  latest_csv="$(_get_latest_csv)"
  echo -e "[latest]:\n${latest_csv}" >&2

  year="${latest_csv:14:4}"
  echo -e "[year]:\n${year}" >&2

  echo "[urls]:" >&2
  curl -sL "https://github.com/${ALTKDB_REPO}/raw/master/${latest_csv}" |
    awk -F '[,"]' 'NR > 1 && $2 != "" {
      print "https://kdb.tsukuba.ac.jp/syllabi/"y"/"$2"/jpn/"
    }' y="$year"
}

# Download stdin urls to a spesific dir.
function _download() {
  local url class_code

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

# Main.
function main() {
  readonly ALTKDB_REPO="Make-IT-TSUKUBA/alternative-tsukuba-kdb"
  readonly DEST="${1-syllabus}"
  mkdir -p "$DEST"
  _get_code_list | _download
}

main "$@"
exit "$?"
