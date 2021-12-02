import os

INPUT_PATH = os.path.join(os.path.dirname(__file__), 'input.txt')
INPUTS = []

with open(INPUT_PATH) as input_file:
    INPUTS = [int(n) for n in input_file.readlines()]


def sum_window(end):
    return INPUTS[end - 2] + INPUTS[end - 1] + INPUTS[end]

count = 0
last_window = 1000000

for i in range(2, len(INPUTS)):
    next_window = sum_window(i)

    if next_window > last_window:
        count += 1

    last_window = next_window

print(count)
