---
title: "DS-Span: Single-Phase Discriminative Subgraph Mining"
date: "2025-11-02"
tag: "Graph Mining • Representation Learning"
summary: "Notes on DS-Span, a one-pass discriminative subgraph miner that doubles as a feature generator for graph embeddings."
---

DS-Span is a subgraph-based graph classification method built around one idea: instead of running a frequent subgraph miner and then a separate discriminative filter in multiple passes, it does **single-phase discriminative mining** in one DFS traversal. During that traversal it grows canonical subgraphs (as in gSpan), uses label information on the fly to score them, and stops exploring graphs once they are “sufficiently covered” by good patterns.

The output is a very small, discriminative set of subgraphs that still covers most graphs in the dataset and works well as an interpretable feature basis for simple embedding models. In experiments, this single-phase pipeline recovers or beats multi-phase baselines while using far fewer patterns and much less mining time. I’ll later link the full paper for details.
