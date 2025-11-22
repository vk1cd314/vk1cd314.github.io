---
title: "Noice Sequence"
date: "2025-02-15"
tag: "Combinatorics • Probability"
summary: "Easy"
---

You get an interval $[0, x]$ (with $0 < x \le 10^{9}$) and must sample $n$ distinct real numbers uniformly at random, where $1 \le n \le 10^{6}$. Because we sample from a continuous distribution, the sequence $S_1, S_2, \dots, S_n$ almost surely contains no duplicates.

The sequence is **Noice** if there exists a unique index $i$ with $1 < i < n$ such that

$$
S_1 < S_2 < \dots < S_i > S_{i+1} > \dots > S_n.
$$

In other words, the sequence climbs strictly, peaks exactly once in the interior, then descends strictly. Fully monotone sequences are disqualified. There may be up to $10^{6}$ test cases; for each case we read $x$ and $n$ and must return the probability that the sampled sequence is Noice, expressed as $p \cdot q^{-1} \bmod 998244353$.

I wrote this one for Problem D of the [Battle of Brains 2023 Mock](https://toph.co/c/cseduic-battle-of-brains-2023-mock). This quite a funny problem, since the initial bounds for $x$ have nothing to do with actually solving the problem! But you could realizing that is essentially solving the problem XD.

### Idea: count unimodal permutations

Sampling distinct reals from $[0,x]$ induces a uniformly random permutation of their ranks. Thus the probability that the sample is Noice equals

$$
\frac{\text{count of unimodal permutations of size } n}{n!}.
$$

So the real task is to count permutations whose unique peak lives strictly inside the sequence.

### Counting argument

Pick the peak position $i$ with $2 \le i \le n-1$. Once $i$ is fixed:

1. Choose which $i-1$ elements lie to the left of the peak. That is $\binom{n-1}{i-1}$.
2. Sort that subset increasingly; sort the remaining $n-i$ elements increasingly as well.

Because sorting enforces the strict rise/fall, each choice of the left subset yields exactly one unimodal permutation with peak at $i$. Summing over $i$ gives

$$
U(n) = \sum_{i=2}^{n-1} \binom{n-1}{i-1} = 2^{n-1} - 2.
$$

Edge cases: if $n < 3$, there is no valid $i$, so $U(n) = 0$ and the probability is zero.

### Probability and modular arithmetic

Let $M = 998244353$. For $n \ge 3$,

$$
\Pr(\text{Noice}) = \frac{U(n)}{n!} = \frac{2^{n-1} - 2}{n!}.
$$

We output $\left( (2^{n-1} - 2) \bmod M \right) \cdot (n!)^{-1} \bmod M$. Precompute factorials and inverse factorials up to $10^{6}$ once, then each test case is $O(1)$.