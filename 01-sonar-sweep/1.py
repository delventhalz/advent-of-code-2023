import os

INPUT_PATH = os.path.join(os.path.dirname(__file__), 'input.txt')
INPUTS = []

with open(INPUT_PATH) as input_file:
    INPUTS = [int(n) for n in input_file.readlines()]


count = 0
last_depth = 1000000

for depth in INPUTS:
    if depth > last_depth:
        count += 1

    last_depth = depth

print(count)
