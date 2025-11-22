---
title: "Festival of Sticks"
date: "2025-02-16"
tag: "Greedy • Extremal"
summary: "Easy"
---

This is a problem made for Battle of Brains 2023 [Problem F](https://toph.co/c/cseduic-battle-of-brains-2023). There is a lot of unnecessary filler in the original statement. But I have provided a brief description of the problem below. It is a simple cute problem but I quite like it :D

### Abridged Statement

For each test case we receive integers $l$ and $r$ ($1 \le l < r \le 10^{9}$). Consider the multiset of all integers in the closed interval $[l, r]$. We must pick a subset of **distinct** lengths of maximal size such that no three chosen lengths $a < b < c$ satisfy the triangle inequality $a + b > c$. Output that maximal size.

This is equivalent to finding the largest subset whose increasing order is _never_ strictly unimodal: every triple must violate the triangle condition.

### General Idea

After playing with this for a while, the pattern becomes obvious. As soon as you keep three consecutive integers, they already make a triangle. The only way to survive is to stretch the gaps between the numbers so much so that each new stick is at least the sum of the previous two. So for 3 sticks it cannot possibly form a triangle. That inherently feels very Fibonacci-esque, and the greedy instinct is to always take the smallest legal next stick so we leave as much space as possible for future picks.

### Why the idea holds

Let $s_1 < s_2 < \dots < s_m$ be any valid selection. Define the **gap condition**

$$
s_t \ge s_{t-1} + s_{t-2} \qquad (\text{for all } t \ge 3).
$$

**Lemma (necessity and sufficiency).** The gap condition holds for every valid set, and any set obeying it is valid.

- *Necessity.* If it failed at some $t$, the three sticks $s_{t-2}, s_{t-1}, s_t$ would satisfy $s_{t-2} + s_{t-1} > s_t$, i.e. they already form a triangle, a contradiction :).
- *Sufficiency.* Assume the inequality holds. For any triple $i < j < k$, monotonicity gives $s_i \le s_{k-2}$ and $s_j \le s_{k-1}$, hence
  $$
  s_i + s_j \le s_{k-2} + s_{k-1} \le s_k,
  $$
  where the last step plugs the gap condition with $t = k$. So no triple ever violates the triangle rule.

### Construction that follows the idea

Now we simply enforce the gap condition greedily. Begin with the tightest possible base:

$$
s_1 = l,\qquad s_2 = l + 1,
$$

then continue with

$$
s_t = s_{t-1} + s_{t-2}
$$

for as long as the new value stays within $[l, r]$. Because we always pick the minimum legal value, this sequence is the slowest-growing valid one—exactly what we want for maximising length. Let $k$ be the final index with $s_k \le r$; that $k$ is our answer.

### Why this is optimal

Take any other valid selection $t_1 < \dots < t_m$. The gap condition forces

$$
t_1 \ge l,\quad t_2 \ge l + 1,\quad t_t \ge t_{t-1} + t_{t-2}\ \text{for } t \ge 3.
$$

By induction, $t_u \ge s_u$ for every $u$. Consequently, the competing sequence can never stay below $r$ longer than the greedy sequence does. Once the greedy construction produces $s_{k+1} > r$, every other sequence also has $t_{k+1} \ge s_{k+1} > r$, so no one can beat length $k$.

### Some Implementation Notes

1. The number of steps is at most $O(\log r)$ because Fibonacci growth is exponential. 
2. For $r - l \le 1$, the answer caps at $2$ since we cannot even reach the third term.
