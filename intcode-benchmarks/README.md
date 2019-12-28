#Intcode Benchmarks

Some benchmarks for various Intcode programs written by
[u/iagueqnar](https://www.reddit.com/user/iagueqnar/) and posted to the
[AoC subreddit](https://www.reddit.com/r/adventofcode/comments/egq9xn/2019_day_9_intcode_benchmarking_suite/).

## Times

| Program | Input | Output | Time |
| :- | :- | :- | :- |
| Sum of Primes | 100000 | `NaN` (!!) | 321ms |
| Ackermann | 3, 6 | 509 | 1,252ms |
| ISqrt | 130 | 11 | 11ms |
| DivMod | 1024, 3 | 1024, 3 | 26ms |
| Prime Factors | 2147483647 | 2147483647 | 13,327ms |
| Prime Factors | 19201644899 | 138569, 138571 | 35,532ms |

The most surprising thing here is that apparently my Intcode implementation is
broken! Got through all of AoC with it but it can't handle something about
`sum-of-primes`. I'll have to investigate later. Otherwise it is comparable to
other JS implementations. Except for prime factors. There it is
_really slooooww_. Curious.
