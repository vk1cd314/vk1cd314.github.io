---
title: "Ant Walking on a Hypercube"
date: "2025-10-22"
tag: "Probability • Combinatorics"
summary: "Hard"
---

This is a random problem I thought of and I was quite happy with my solution below… and then later discovered this is a known problem (very unfortunate). This page is my cleaned‑up version of the argument, plus an explicit comparison with the other solution I later found. 

### Problem statement

The $n$‑dimensional hypercube $Q_n$ has:

- vertices: all bitstrings of length $n$, i.e. $\{0,1\}^n$;
- edges: two vertices are adjacent iff they differ in exactly one coordinate.

An ant starts at a fixed vertex, say $0^n = (0,\dots,0)$. At each step it:

1. chooses one of the $n$ incident edges uniformly at random;
2. walks across that edge to the neighbouring vertex.

The ant repeats this for exactly $m$ steps. Edges and vertices can be revisited.

 What is the probability that, after the $m$‑th move, the ant is back at $0^n$?

---

Two immediate observations:

- The cube is bipartite: it splits into “even Hamming weight” and “odd Hamming weight” vertices, and every step flips parity. So for odd $m$ the probability is **exactly zero**.
- For even $m$, the probability is $>0$ and does not depend on which vertex you started from, by symmetry.

Everything below is about the even $m$ case.

### Step 1: rewrite the walk as coordinate flips

On each move the ant flips exactly one bit. Let $C_i$ be the number of times the $i$‑th coordinate was flipped over the $m$ steps.

The ant returns to $0^n$ **iff**

$$
C_1, C_2, \dots, C_n \text{ are all even.}
$$

Indeed, if $C_i$ is even then the $i$‑th bit has been flipped back an even number of times and ends at $0$ again; if some $C_i$ is odd, that bit ends at $1$.

So the problem reduces to:

> We perform $m$ independent trials; at each trial we pick a coordinate $i \in \{1,\dots,n\}$ uniformly and increase $C_i$ by $1$. What is the probability that all $C_i$ end up even?

---

### Step 2: encode “even” using signs

For a **single** integer $c$, the indicator “$c$ is even” has a very simple formula:

$$
\mathbf{1}_{\{c \text{ even}\}}
  = \frac{1 + (-1)^c}{2}.
$$

- If $c$ is even, then $(-1)^c = 1$ and the right-hand side is $(1+1)/2 = 1$.
- If $c$ is odd, then $(-1)^c = -1$ and the right-hand side is $(1-1)/2 = 0$.

For our vector $(C_1,\dots,C_n)$ this gives

$$
\mathbf{1}_{\{\text{all } C_i \text{ even}\}}
  = \prod_{i=1}^n \frac{1 + (-1)^{C_i}}{2}
  = 2^{-n} \prod_{i=1}^n (1 + (-1)^{C_i}).
$$

Taking the expected value, the probability we want is

$$
\Pr[\text{return after } m]
  = \mathbb{E}\Big[\mathbf{1}_{\{\text{all } C_i \text{ even}\}}\Big]
  = 2^{-n} \, \mathbb{E}\Big[\prod_{i=1}^n (1 + (-1)^{C_i})\Big].
$$

So all we have to do is understand this.

---

### Step 3: expand the product as a sum over sign vectors

Expand the product

$$
\prod_{i=1}^n (1 + (-1)^{C_i})
$$

in the usual way: for each $i$ you either pick the $1$ or pick $(-1)^{C_i}$. That choice can be encoded by a sign $x_i \in \{\pm1\}$:

- $x_i = +1$ means “take the $1$ term”,
- $x_i = -1$ means “take the $(-1)^{C_i}$ term”.

Thus

$$
\prod_{i=1}^n (1 + (-1)^{C_i})
  = \sum_{x \in \{\pm1\}^n} \prod_{i : x_i = -1} (-1)^{C_i}
  = \sum_{x \in \{\pm1\}^n} \prod_{i=1}^n x_i^{C_i}.
$$

(The last equality uses that if $x_i = +1$ then $x_i^{C_i} = 1$, and if $x_i = -1$ then $x_i^{C_i} = (-1)^{C_i}$.)

Plug this back into the expectation:

$$
\Pr[\text{return after } m]
  = 2^{-n} \sum_{x \in \{\pm1\}^n}
      \mathbb{E}\left[\prod_{i=1}^n x_i^{C_i}\right].
$$

So the whole problem is now to compute

$$
\mathbb{E}\left[\prod_{i=1}^n x_i^{C_i}\right]
$$

for a fixed sign vector $x$.

---

### Step 4: compute that expectation from the process definition

Think of the walk step by step. Initially $C_i = 0$ for all $i$, so the product is $1$.

Each time we make a move:

- we pick a coordinate $J \in \{1,\dots,n\}$ uniformly at random,
- we replace $C_J$ by $C_J + 1$,
- which multiplies the product $\prod_{i=1}^n x_i^{C_i}$ by $x_J$ (because the exponent of $x_J$ increases by $1$).

Thus after one step, conditioned on the choice of $J$,

$$
\prod_{i=1}^n x_i^{C_i} = x_J.
$$

Taking expectation over the random choice of $J$,

$$
\mathbb{E}\left[\prod_{i=1}^n x_i^{C_i} \,\middle|\,\text{after 1 step}\right]
  = \frac{1}{n} \sum_{j=1}^n x_j.
$$

The key point is that every step behaves the same way, and the steps are independent. Each step multiplies the product by a random $x_J$ whose mean is $\frac{1}{n}\sum_j x_j$. Therefore, after $m$ steps,

$$
\mathbb{E}\left[\prod_{i=1}^n x_i^{C_i}\right]
  = \left(\frac{x_1 + x_2 + \cdots + x_n}{n}\right)^m.
$$

This is exactly the heuristic “at each step you multiply by the average of the $x_i$” made rigorous.

Putting this back into the probability formula,

$$
\Pr[\text{return after } m]
  = 2^{-n} \sum_{x \in \{\pm1\}^n}
      \left(\frac{x_1 + \cdots + x_n}{n}\right)^m.
$$

---

### Step 5: group sign vectors by how many minuses they have

The sum only depends on $x$ through the sum $x_1 + \cdots + x_n$. Let $k$ be the number of coordinates with $x_i = -1$. Then:

- there are $\binom{n}{k}$ choices of which coordinates are negative;
- for any such choice,
  $$
  x_1 + \cdots + x_n = (n-k)\cdot(+1) + k\cdot(-1) = n - 2k.
  $$

So

$$
\Pr[\text{return after } m]
  = 2^{-n} \sum_{k=0}^{n} \binom{n}{k}
      \left(\frac{n - 2k}{n}\right)^m
  = \frac{1}{2^n} \sum_{k=0}^{n} \binom{n}{k}
      \left(1 - \frac{2k}{n}\right)^m.
$$

This is the final closed‑form probability.

- For odd $m$, the terms for $k$ and $n-k$ cancel (one is the negative of the other), so the sum is $0$, as expected from bipartiteness.
- For even $m$, the sum is positive and tends to $2^{-n}$ as $m \to \infty$; that is the stationary probability of being at any fixed vertex.


---

### This problem already exists 

After doing all of this, I eventually found the MathOverflow question. Realistically googling the problem should have been the first thing I should have done ;-;

> “Probability of return at step n of a random walk to its starting vertex”
>
> https://mathoverflow.net/questions/59661/probability-of-return-at-step-n-of-a-random-walk-to-its-starting-vertex

But I was still happy that I was able to find a different solution to this :D