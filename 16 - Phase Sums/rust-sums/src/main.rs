extern crate chrono;
extern crate rayon;
use std::cmp::min;
use chrono::Local;
use rayon::prelude::*;

const THREAD_COUNT: usize = 16;
const REPETITIONS: usize = 10000;
const OFFSET: usize = 5972877;
const INPUTS: [i32; 650] = [5, 9, 7, 2, 8, 7, 7, 6, 1, 3, 7, 8, 3, 1, 9, 6, 4, 4, 0, 7, 9, 7, 3, 9,
    6, 2, 0, 0, 2, 1, 9, 0, 9, 0, 6, 7, 6, 6, 3, 2, 2, 6, 5, 9, 3, 0, 3, 4, 7, 9, 5, 6, 4, 5, 1, 8,
    5, 0, 2, 2, 5, 4, 6, 8, 5, 7, 0, 6, 0, 2, 5, 7, 9, 5, 8, 2, 4, 8, 7, 2, 9, 0, 1, 4, 6, 5, 8, 3,
    8, 7, 8, 2, 4, 7, 4, 0, 7, 8, 1, 3, 5, 4, 7, 9, 5, 0, 4, 3, 5, 1, 7, 5, 4, 5, 9, 7, 3, 1, 8, 6,
    0, 3, 8, 9, 8, 2, 4, 9, 3, 6, 5, 8, 8, 6, 3, 7, 3, 2, 5, 7, 5, 0, 7, 6, 0, 0, 3, 2, 3, 8, 2, 0,
    0, 9, 1, 3, 3, 3, 9, 2, 4, 8, 2, 3, 5, 3, 3, 9, 7, 6, 7, 2, 3, 3, 2, 4, 0, 7, 0, 5, 2, 0, 9, 6,
    1, 2, 1, 7, 6, 2, 7, 4, 3, 0, 3, 2, 3, 3, 3, 6, 2, 0, 4, 5, 2, 4, 2, 4, 7, 7, 2, 1, 5, 9, 3, 8,
    5, 9, 2, 2, 6, 7, 0, 4, 4, 8, 5, 8, 4, 9, 4, 9, 1, 4, 1, 8, 1, 2, 9, 9, 0, 8, 8, 8, 5, 9, 4, 0,
    0, 6, 4, 6, 6, 4, 1, 1, 5, 8, 8, 2, 3, 9, 2, 0, 4, 3, 9, 7, 5, 9, 9, 7, 8, 6, 2, 5, 0, 2, 8, 3,
    2, 7, 9, 1, 7, 5, 3, 4, 4, 3, 4, 7, 5, 7, 3, 3, 9, 7, 2, 8, 3, 2, 3, 4, 1, 2, 1, 1, 4, 3, 2, 3,
    2, 2, 1, 0, 8, 2, 9, 8, 5, 1, 2, 5, 1, 2, 5, 5, 3, 1, 1, 4, 5, 3, 3, 9, 2, 9, 9, 0, 6, 7, 1, 8,
    6, 8, 3, 7, 3, 4, 2, 1, 1, 7, 7, 8, 7, 3, 7, 5, 1, 1, 6, 0, 9, 2, 2, 6, 1, 8, 4, 5, 3, 8, 9, 7,
    3, 0, 9, 2, 8, 0, 4, 7, 1, 5, 0, 3, 5, 0, 9, 6, 9, 3, 3, 1, 6, 0, 8, 2, 6, 7, 3, 3, 7, 5, 1, 9,
    3, 6, 0, 5, 6, 3, 1, 6, 5, 8, 6, 6, 1, 8, 8, 3, 7, 3, 2, 6, 1, 4, 4, 8, 4, 6, 6, 0, 7, 1, 8, 1,
    5, 9, 1, 9, 5, 7, 8, 0, 2, 1, 2, 7, 2, 8, 3, 7, 5, 8, 4, 7, 8, 2, 5, 6, 8, 6, 0, 6, 7, 3, 6, 1,
    6, 5, 7, 6, 0, 6, 1, 3, 7, 4, 6, 8, 7, 1, 0, 4, 5, 3, 4, 4, 7, 0, 1, 0, 2, 3, 4, 6, 7, 9, 6, 5,
    3, 6, 0, 5, 1, 5, 0, 7, 5, 8, 3, 4, 7, 1, 8, 5, 0, 3, 8, 2, 6, 7, 8, 9, 5, 9, 3, 9, 4, 4, 8, 6,
    8, 0, 1, 9, 5, 2, 8, 4, 1, 7, 7, 7, 6, 4, 1, 7, 6, 3, 5, 4, 7, 4, 2, 2, 1, 1, 6, 9, 8, 1, 5, 2,
    7, 2, 6, 4, 8, 7, 7, 6, 3, 6, 8, 9, 2, 4, 1, 4, 0, 0, 6, 8, 5, 5, 3, 3, 2, 0, 7, 8, 2, 2, 5, 3,
    1, 0, 9, 1, 2, 7, 9, 3, 4, 5, 1, 2, 2, 7, 3, 0, 5, 4, 2, 5, 9, 7, 6, 3, 3, 5, 0, 2, 6, 6, 2, 0,
    6, 7, 0, 4, 5, 5, 2, 4, 0, 0, 8, 7, 9, 3, 3, 4, 0, 9];

fn ones(num: i32) -> i32 {
    if num < 0 {
        -num % 10
    } else {
        num % 10
    }
}

fn sum_slice(nums: &Vec<i32>, start: usize, desired_stop: usize) -> i32 {
    let stop = min(nums.len(), desired_stop);
    let mut sum = 0;
    let mut index = start;

    while index < stop {
        sum += nums[index];
        index += 1;
    }

    sum
}

fn quick_phased_sum(nums: &Vec<i32>, repetitions: usize) -> i32 {
    let stop = nums.len();
    let mut sum = 0;
    let mut index = repetitions - 1;
    let mut should_add = true;

    while index < stop {
        if should_add {
            sum += sum_slice(&nums, index, index + repetitions);
        } else {
            sum -= sum_slice(&nums, index, index + repetitions);
        }
        index += repetitions + repetitions;
        should_add = !should_add;
    }

    sum
}

fn get_message(digits: &Vec<i32>, offset: usize) -> String {
    digits[offset..offset + 8].iter().map(ToString::to_string).collect()
}

fn  get_timestamp() -> String {
    Local::now().format("%Y-%m-%d %H:%M:%S").to_string()
}

fn collect_new_phased_digits(digits: &Vec<i32>) -> Vec<i32> {
    let section_length = digits.len() as f64 / THREAD_COUNT as f64;

    (0..THREAD_COUNT)
        .into_par_iter()
        .flat_map(|i| {
            let start = (i as f64 * section_length + 1.0) as usize;
            let stop = ((i as f64 + 1.0) * section_length + 1.0) as usize;
            let mut section = Vec::with_capacity(stop - start);

            for reps in start..stop {
                section.push(ones(quick_phased_sum(&digits, reps)));
            }

            section
        })
        .collect::<Vec<i32>>()
}

fn main() {
    let mut digits: Vec<i32> = (0..REPETITIONS)
        .flat_map(|_| { INPUTS.iter().cloned() })
        .collect::<Vec<i32>>();
    let digits_length = digits.len();

    println!("[{}] Running 100 phase sums on {} digits...", get_timestamp(), digits_length);

    for sums_completed in 1..101 {
        digits = collect_new_phased_digits(&digits);

        println!("[{}] Phase sums completed: {}", get_timestamp(), sums_completed);
    }

    println!("[{}] Message: {}", get_timestamp(), get_message(&digits, OFFSET));
}


// Your puzzle answer was 84024125.
