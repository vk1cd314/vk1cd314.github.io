---
title: "This Is The Easiest Problem Trust Me Bro"
date: "2025-10-22"
tag: "Number Theory • Greedy"
summary: "Medium"
---

### Problem

You are given $n$ positive integers $A_0, A_1, \dots, A_{n-1}$ such that $\gcd(A_i, A_j) = 1$ for $i \ne j$. You must partition the array into $k$ non-empty disjoint subsets $S_0, S_1, \dots, S_{k-1}$ with $1 \le k \le n$.

Define
$$
f(n) = \left|\{(a,b) \in \mathbb{N}^2 : \gcd(a,b)=1,\ ab = n\}\right|.
$$

The score of a partition is
$$
\sum_{i=0}^{k-1} f\!\left(\prod_{x \in S_i} x\right),
$$
and we want the maximum possible score modulo $998244353$.

### Note

I authored this for Problem J in [Battle of Brains 2024](https://toph.co/c/battle-brains-2024). The title was half-joke, half-bait. Contestants saw the scary definition of $f(n)$ and the partitioning requirement, but the whole problem simplifies to a tiny extremal inequality once you notice the numbers are pairwise coprime.

### Idea: Simplify what partitions mean

Key observations:

1. If $n = \prod p_i^{e_i}$, then every coprime pair $(a,b)$ with $ab=n$ must assign each prime power wholly to either $a$ or $b$, hence
   $$
   f(n) = 2^{\omega(n)},
   $$
   where $\omega(n)$ counts distinct primes of $n$.
2. Because the inputs are pairwise coprime, primes never collide between different $A_i$. For any subset $S$,
   $$
   \omega\!\left(\prod_{x \in S} x\right) = \sum_{x \in S}\omega(x),
   \quad\text{so}\quad
   f\!\left(\prod_{x \in S} x\right) = \prod_{x \in S} 2^{\omega(x)}.
   $$

Therefore each block contributes a product of numbers $P_S = \prod_{x \in S} 2^{\omega(x)}$, each at least $2$.

### Why “one block” is optimal

Let the partition produce block values $P_1, \dots, P_k$ with each $P_j \ge 2$. If we merge two blocks worth $P$ and $Q$, the new contribution is $PQ$. But since $P,Q \ge 2$, we have $PQ \ge P + Q$ (strictly $>$ unless $P = Q = 2$). Repeatedly merging never decreases the score, so the maximal value is obtained by merging everything into a single block:

$$
\max = f\!\left(\prod_{i=0}^{n-1} A_i\right) = 2^{\sum_{i=0}^{n-1} \omega(A_i)}.
$$

All the scary partitioning is a red herring; we only need the total number of distinct prime factors across the entire array.

### Implementation sketch

1. Precompute smallest prime factors (SPF) up to $5 \cdot 10^6$.
2. For each $A_i$, use the SPF table to count $\omega(A_i)$ (skip repeated primes).
3. Sum all $\omega(A_i)$ to get $\Omega$.
4. Answer is $2^{\Omega} \bmod 998244353$ (use fast exponentiation).

Complexity: $O(M)$ for the sieve ($M \le 5 \cdot 10^6$) plus linear factorisation over the array.
