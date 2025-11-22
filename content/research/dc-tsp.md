---
title: "Divide-and-Conquer TSP via Learned Sparsification and 2-Edge Cuts"
date: "2025-11-02"
tag: "TSP • Neural CO"
summary: "Undergrad thesis: learning to sparsify and partition TSP instances so existing solvers scale to larger graphs."
---

This write-up summarizes my undergrad thesis, *Learning Sparsification and Partitioning for Generalizing Routing Problems on Larger Instances*, with a focus on the mathematical structure rather than background on the Traveling Salesman Problem (TSP) itself.

At a high level, the work has two tightly coupled parts:

- **Learnt Edge Sparsification (LES):** a Residual GatedGCN that learns, from optimal tours, which edges of a dense TSP instance can be safely discarded while preserving an optimal tour.
- **2-edge-cut based divide–and–conquer:** a structural algorithm that, on the resulting sparse graph, uses 2-edge cuts to decompose the instance into smaller subproblems, which are solved independently and then recombined into a global tour.

The goal is not to replace state-of-the-art solvers, but to **preprocess** their input instances into something structurally much easier.

---

## 1. Learnt Edge Sparsification (LES)

### 1.1 Edge classification formulation

Given a TSP instance as a complete weighted graph
$$
G = (V, E), \quad |V| = n,\quad E = \{(i,j) : i \neq j\},
$$
let $T^* \subseteq E$ be the edge set of an optimal Hamiltonian tour obtained using a strong solver (e.g. Concorde) during data generation.

We define **binary labels**
$$
y_{ij} =
\begin{cases}
1 & \text{if } (i,j) \in T^*,\\
0 & \text{otherwise}.
\end{cases}
$$

The sparsifier is a function
$$
\Phi_\theta : \mathcal{G} \to [0,1]^E,\qquad
\Phi_\theta(G) = (\hat y_{ij})_{(i,j)\in E}
$$
parameterized by neural weights $\theta$, where $\hat y_{ij}$ approximates
$$
\hat y_{ij} \approx \Pr[(i,j) \text{ is used in (at least one) optimal tour} \mid G].
$$

At inference time, we produce a **sparse subgraph**
$$
G_\tau = (V, E_\tau), \qquad
E_\tau = \{(i,j) \in E : \hat y_{ij} \ge \tau\},
$$
for some threshold $\tau \in (0,1)$. The goal is to have:

- **Edge preservation:** $T^* \subseteq E_\tau$ with high probability over the instance distribution;
- **Strong sparsity:** $|E_\tau| \ll |E| = \Theta(n^2)$, ideally $|E_\tau| = O(\alpha n)$ for modest $\alpha$.

### 1.2 Residual GatedGCN edge embeddings

To predict edge importance, LES uses a Residual Gated Graph Convolutional Network (ResGatedGCN) with both node and edge embeddings.

For each layer $l = 0,1,\dots,L$,

- each node $i \in V$ has an embedding $h_i^{(l)} \in \mathbb{R}^{d_n}$,
- each edge $(i,j) \in E$ has an embedding $e_{ij}^{(l)} \in \mathbb{R}^{d_e}$.

A typical layer performs:
$$
\begin{aligned}
h_i^{(l+1)} &= h_i^{(l)} +
  \mathrm{NodeGatedConv}\Big(
    h_i^{(l)}, \{h_j^{(l)}, e_{ij}^{(l)} : j \in \mathcal{N}(i)\}
  \Big),\\[4pt]
e_{ij}^{(l+1)} &= e_{ij}^{(l)} +
  \mathrm{EdgeGatedConv}\big(
    e_{ij}^{(l)}, h_i^{(l)}, h_j^{(l)}
  \big).
\end{aligned}
$$

The “gated” part means message contributions are modulated by scalar gates
$$
g_{ij}^{(l)} = \sigma\!\left( W_g
  [\,h_i^{(l)} \parallel h_j^{(l)} \parallel e_{ij}^{(l)}\,] \right),
$$
so that information along each edge can be selectively amplified or damped.
Residual connections (adding the previous embeddings) stabilize deep message passing and help gradients flow.

After $L$ layers we obtain final edge embeddings $e_{ij}^{(L)}$. An MLP produces probabilities
$$
\hat y_{ij} = \sigma\big(\mathrm{MLP}(e_{ij}^{(L)})\big),
$$
where $\sigma$ is a logistic sigmoid.

### 1.3 Loss: class imbalance and explicit sparsity

On a complete graph, only $n$ edges belong to any tour, while there are $\Theta(n^2)$ edges total. So the positive class (“in the optimal tour”) is extremely rare.

To train $\Phi_\theta$ we use:

1. **Weighted binary cross-entropy** to handle imbalance:
   $$
   L_{\mathrm{wBCE}}
     = - \sum_{(i,j)\in E}
        \Big[
          w_1\, y_{ij} \log \hat y_{ij}
          + w_0\, (1-y_{ij}) \log(1-\hat y_{ij})
        \Big],
   $$
   with $w_1 \gg w_0$.

2. **Sparsity regularization** to penalize keeping too many edges:
   $$
   L_{\mathrm{sparse}}
     = \lambda \sum_{(i,j)\in E} \hat y_{ij},
   $$
   where $\lambda > 0$ is a hyperparameter.

The total training objective is
$$
L_{\mathrm{total}}(\theta)
  = L_{\mathrm{wBCE}} + L_{\mathrm{sparse}}.
$$

- The first term forces the classifier to recover all optimal edges.
- The second term explicitly discourages high-density predictions and counteracts the tendency to mark many edges as “possibly useful”.

After training, a threshold $\tau$ is selected (by validation) to trade off between sparsity and risk of dropping optimal edges. The resulting map
$$
S_\tau(G) = (V, E_\tau)
$$
is LES: a learned sparsifier tailored to TSP structure rather than a naive geometric rule like k‑nearest neighbors.

---

## 2. Divide–and–Conquer via 2-Edge Cuts

Once the graph is sparsified by LES, the second part of the thesis is an **exact** divide–and–conquer scheme that uses 2-edge cuts to break the instance into smaller pieces.

### 2.1 2-edge cuts

Let $G' = (V, E')$ be a sparse TSP graph (for us, typically $E' = E_\tau$ from LES). A **2-edge cut** is a pair of distinct edges
$$
\{e_1, e_2\} \subset E'
$$
such that removing both edges disconnects the graph into at least two components, and no proper subset of $\{e_1,e_2\}$ disconnects it.

In other words, $\{e_1, e_2\}$ is a size-2 minimal edge cut.

Two key facts make such cuts interesting in the TSP context:

1. Any Hamiltonian cycle must cross each edge cut an **even** number of times.
2. For a *minimal* 2-edge cut in a 2-edge-connected graph, a Hamiltonian cycle that exists must cross that cut **exactly twice**—using both edges in the cut.

So, when we find a 2-edge cut $\{(u,v), (x,y)\}$ in a sparse TSP instance that still admits a Hamiltonian cycle, we can safely assume any optimal tour uses both edges to go “in and out” of the region defined by the cut.

In the thesis we use Georgiadis–Kaplan–Tarjan’s GK-2E algorithm as a 2-edge-cut oracle, exposed as `VEcut-GK-2E(G)` inside a small library we built (`pycuts`).

### 2.2 Turning 2-edge cuts into subproblems

Consider a sparse TSP instance $G' = (V,E')$ and a 2-edge cut
$$
\{(u,v), (x,y)\} \subset E'
$$
that we decide to use as a decomposition point.

1. Remove both edges:
   $$
   G' \setminus \{(u,v),(x,y)\} = (V, E' \setminus \{(u,v),(x,y)\}).
   $$
   The graph splits into two connected components:
   $$
   G_1 = (V_1, E_1),\quad G_2 = (V_2, E_2),\quad
   V_1 \cup V_2 = V,\quad V_1 \cap V_2 = \emptyset.
   $$

2. The endpoints $\{u,v,x,y\}$ lie on the boundary between components. Assume (w.l.o.g.) that $u,x \in V_1$ and $v,y \in V_2$.

3. Any global Hamiltonian cycle that crosses this cut must enter and leave each component exactly once, using both $(u,v)$ and $(x,y)$. In particular, its restriction to $G_1$ is a Hamiltonian path from $u$ to $x$, and its restriction to $G_2$ is a Hamiltonian path from $v$ to $y$.

Instead of working with “path” problems explicitly, we encode each subproblem again as a **TSP instance** by introducing a dummy node.

For $G_1$:

- Add a new vertex $d_1$ and connect it to all vertices in $V_1$.
- Set $c(d_1,u) = c(d_1,x) = 0$ and $c(d_1,z) = M$ (a very large constant) for all other $z \in V_1 \setminus\{u,x\}$.

Then any optimal TSP tour on $G_1 \cup \{d_1\}$ will use the two zero-cost edges $(d_1,u)$ and $(x,d_1)$ and avoid the $M$-cost edges. Removing $d_1$ and these two incident edges recovers a shortest Hamiltonian path from $u$ to $x$ in $G_1$. The same trick is applied on $G_2$ with a dummy node $d_2$ and special edges to $v,y$.

The important point is that **each subproblem is again a TSP instance** (on $V_1 \cup\{d_1\}$ and $V_2 \cup\{d_2\}$), so we can re-run the same LES + 2-edge-cut pipeline recursively on these smaller TSPs if we want further decomposition, or drop to a standard TSP solver when they are small.

### 2.3 Recursive algorithm

The full divide–and–conquer routine, **OptimalPartition**, is defined recursively on a (sparse) TSP instance $G$:

1. If $|V(G)| \le \lambda$ (a size threshold), solve TSP on $G$ directly with a strong solver. Return that tour.

2. Otherwise:
   - Run GK-2E on $G$ to obtain a 2-edge cut $\{(u,v),(x,y)\}$.
   - Remove both edges, producing components $G_1,G_2$ and boundary vertices $u,x$ in $G_1$, $v,y$ in $G_2$.
   - For each component, add a dummy node ($d_1$ in $G_1$, $d_2$ in $G_2$) and connect it as described above to turn each $G_i$ into a smaller TSP instance $G_i'$.
   - Optionally apply LES again to $G_1',G_2'$ to re-sparsify, then recursively call `OptimalPartition` on each of them.

3. In the **combine** step:
   - From the recursive solutions on $G_1',G_2'$, delete dummy nodes $d_1,d_2$ and their incident edges, leaving Hamiltonian paths in $G_1,G_2$ between the appropriate boundary vertices.
   - Add back the original 2-edge-cut edges $(u,v)$ and $(x,y)$ to glue the two paths into a single Hamiltonian cycle on the original vertex set.

The correctness argument rests on two layers:

- 2-edge cuts in a 2-edge-connected TSP graph must be crossed exactly twice by any Hamiltonian cycle, so global optimal tours induce Hamiltonian paths with the specified boundary pairs inside each component.
- The dummy-node construction ensures that solving TSP optimally on each $G_i'$ is equivalent to solving that constrained path problem, so combining the local optima along the cut recovers a global optimum.

### 2.4 Complexity on sparse graphs

Assume LES has produced a sparse graph with
$$
|E'| = \Theta(|V|) = \Theta(n),
$$
and that we only recurse on TSP instances that stay sparse (we re-sparsify after adding dummy nodes).

At each recursion level:

- The total number of edges across all current subinstances is $O(n)$.
- Running GK-2E on each subinstance costs $O(|E| \log |V|)$ on that subgraph, so across all subinstances the cost per level is $O(n \log n)$.

If each 2-edge cut splits off subinstances of nontrivial size, the recursion depth is at most $O\!\left(\log \frac{n}{\lambda}\right)$ before all subproblems drop below the base-case size $\lambda$.

Thus the total structural overhead for partitioning (ignoring the cost of base-case TSP solves) is
$$
O\big(n \log n \cdot \log (n/\lambda)\big).
$$

Because LES makes $|E'|$ linear in $n$, this is a substantial improvement over operating directly on the dense $O(n^2)$-edge graph. The heavy TSP work is now concentrated in many smaller, structurally simpler subinstances, and much of it can be parallelized.

---

## 3. Putting it together

The overall pipeline is:

1. **Dense instance $\to$ LES sparsification.**  
   Learn $\Phi_\theta$ from optimal tours and apply
   $$
   G \mapsto G_\tau = (V, E_\tau),
   $$
   with $T^* \subseteq E_\tau$ and $|E_\tau| = O(\alpha n)$ in practice.

2. **Sparse instance $\to$ 2-edge-cut decomposition.**  
   Use GK-2E to extract a hierarchy of 2-edge cuts on $G_\tau$, and run the recursive `OptimalPartition` to break the problem into smaller TSP subproblems (with dummy nodes) that can themselves be sparsified.

3. **Solve and recombine.**  
   Solve each terminal subproblem with your favorite exact / near-exact TSP solver, strip dummy nodes to recover paths, and glue those paths back together using the 2-edge cuts.
