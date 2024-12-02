#! /bin/bash

# Fully automated Advent of Code runner for JavaScript:
#   - Opens AoC website
#   - Creates and opens stub file
#   - Downloads and saves puzzle input
#   - Runs solutions in a loop
#   - Directly submits answers
#   - Copies a solved part 1 over to part 2 stub file and opens file
#   - Reports solve durations
#
# Queues up today's AoC problem by default, except after 11pm EST, when it waits
# for tomorrow's to begin. Can specify a different year and day with command
# line args.
#
# Must set the AOC_COOKIE, AOC_REPO, and AOC_CONTACT environment variables to be
# used in curl requests.
#
# Usage:
#   ./go
#   ./go 2023 5

export TZ="America/New_York"

if [[ -z $AOC_COOKIE || -z $AOC_REPO || -z $AOC_CONTACT ]]; then
  echo "Must set AOC_COOKIE, AOC_REPO, and AOC_CONTACT environment variables"
  exit 1
fi

dir_name="wip"

part1_name="1.js"
part2_name="2.js"
input_name="input.txt"
answer1_name="answer-1.txt"
answer2_name="answer-2.txt"

header_path="templates/header.js"
stub_path="templates/stub.js"

success_pattern="That's the right answer!"
failure_pattern="That's not the right answer.*using the full input data"
rate_limit_pattern="You gave an answer too recently.*left to wait. "


### SETUP ###
year=$1
day=$2

function set_default_date() {
  year=$(date +%Y)

  current_month=$(date +%m)
  current_day=$((10#$(date +%d)))
  current_hour=$(date +%H)

  if [[ $current_hour -lt 23 ]]; then
    if [[ $current_month -eq 12 || $current_day -lt 26 ]]; then
      day=$current_day
    else
      echo "No Advent of Code today, you must specify a year and day!"
      exit 1
    fi
  else
    if [[ $current_month -eq 11 && $current_day -eq 30 ]]; then
      day=1
    elif [[ $current_month -eq 12 || $current_day -lt 25 ]]; then
      day=$(($current_day + 1))
    else
      echo "No Advent of Code tonight, you must specify a year and day!"
      exit 1
    fi
  fi
}

if [[ -z $year && -z $day ]]; then
  set_default_date
elif [[ -n $year && -z $day ]]; then
  echo "Must specify both a year and a day!"
  exit 1;
fi

if [[ $(date +%H) -eq 23 ]]; then
  echo "Waiting to begin Day $day until midnight EST..."
  now=$(date +%s)
  midnight=$(date -v${day}d -v0H -v0M -v0S +%s)
  sleep $(( midnight - now ))
fi


### GO ###
start=$(date +%s)
url="https://adventofcode.com/$year/day/$day"

open $url
sleep 1

puzzle_html=$(curl -s -b "$AOC_COOKIE" -A "$AOC_REPO by $AOC_CONTACT" "$url")
sleep 1

puzzle_input=$(curl -s -b "$AOC_COOKIE" -A "$AOC_REPO by $AOC_CONTACT" "$url/input")
sleep 1


### CREATE INITIAL FILES ###
parse_puzzle_name() {
  name=$(echo "$puzzle_html" | grep -o "<h2>--- Day $day: .* ---</h2>")
  name=${name/<h2>--- Day $day: /}
  name=${name/ ---<\/h2>/}
}

parse_template_stub() {
  stub=$(< "$stub_path")
}

parse_template_headers() {
  header=$(< "$header_path")
  header=${header//\{\{YEAR\}\}/$year}
  header=${header//\{\{DAY\}\}/$day}
  header=${header//\{\{NAME\}\}/$name}

  part1_header=${header//\{\{SUBTITLE\}\}/\(Part 1\)}
  part1_header=${part1_header//\{\{SUFFIX\}\}/}

  part2_header=${header//\{\{SUBTITLE\}\}/\(Part 2\)}
  part2_header=${part2_header//\{\{SUFFIX\}\}/#part2}
}

parse_config() {
  if [[ -n $name ]]; then
    dir_name="$(echo "$name" | tr A-Z a-z)"
    dir_name="${dir_name// /-}"
    dir_name="$day-$dir_name"
    if [[ $day -lt 10 ]]; then
      dir_name="0$dir_name"
    fi
  fi


  part1_path="$dir_name/$part1_name"
  part2_path="$dir_name/$part2_name"\
  input_path="$dir_name/$input_name"
  answer1_path="$dir_name/$answer1_name"\
  answer2_path="$dir_name/$answer2_name"
}

parse_puzzle_name
parse_template_stub
parse_template_headers
parse_config

if [[ -d "$dir_name" ]]; then
  echo "Skipping create for existing directory: $dir_name"
else
  mkdir "$dir_name"
fi

if [[ -f "$part1_path" ]]; then
  echo "Skipping create for existing file: $part1_path"
else
  echo -e "$part1_header\n\n$stub" > "$part1_path"
fi

if [[ -f "$input_path" ]]; then
  echo "Skipping create for existing file: $input_path"
else
  echo "$puzzle_input" > "$input_path"
fi

open "$part1_path"
sleep 1
open "$input_path"


### COMMAND LOOP ###

current_part=1
part1_end="$start"
part2_end="$start"

run_solution() {
  if [[ $current_part -eq 1 ]]; then
    npm start "$part1_path"
  else
    npm start "$part2_path"
  fi
}

go_to_next_part() {
  if [[ $current_part -eq 1 ]]; then
    part1_end=$(date +%s)
    current_part=2

    open "$url#part2"
    sleep 1

    if [[ -f "$part2_path" ]]; then
      echo "Skipping create for existing file: $part2_path"
    else
      # Copy Part 1 to Part 2 other than header
      part1=$(< "$part1_path")
      part2=${part1/"$part1_header"/"$part2_header"}
      echo "$part2" > "$part2_path"
    fi

    open "$part2_path"
  else
    part2_end=$(date +%s)
    part1_dur=$(date -r $(( $part1_end - $start )) -u +%H:%M:%S)
    part2_dur=$(date -r $(( $part2_end - $start )) -u +%H:%M:%S)
    echo "Finished in $part1_dur / $part2_dur"
    exit 0
  fi
}

submit_answer() {
  if [[ $current_part -eq 1 ]]; then
    answer=$(cat "$answer1_path" | head -1 | xargs)
  else
    answer=$(cat "$answer2_path" | head -1 | xargs)
  fi

  ./submit $year $day $current_part $answer
  submit_result=$?

  # Move on if submit was a success
  if [[ $submit_result -eq 0 ]]; then
    go_to_next_part
  fi

  # Exit if submit failed due to an error
  if [[ $submit_result -eq 1 ]]; then
    exit 1
  fi
}

quit_go() {
  echo ">>> Are you sure you want to quit [y,n]?"
  read -n 1 confirm
  echo ""
  echo ""
  if [[ $confirm == y ]]; then
    exit 0
  fi
}

print_help() {
  echo "r - run solution code (alt: press enter)"
  echo "s - submit the most recently generated solution"
  echo "x - skip solving this part"
  echo "q - quit"
  echo "? - print help"
  echo ""
}

while true; do
  echo ">>> Part $current_part [r,s,x,q,?]:"
  read -n 1 command
  echo ""
  echo ""

  if [[ $command == r || -z $command ]]; then
    run_solution
  elif [[ $command == s ]]; then
    submit_answer
  elif [[ $command == x ]]; then
    go_to_next_part
  elif [[ $command == q ]]; then
    quit_go
  elif [[ $command == \? ]]; then
    print_help
  fi
done
