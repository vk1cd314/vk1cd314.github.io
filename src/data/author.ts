export const author = {
  name: "Bholanath Das Niloy",
  title: "Computational Optimization Researcher",
  description:
    "I’m currently a Software Engineer L2 at Chaldal, one of the few YC-backed companies in Bangladesh, where I work on large-scale logistics and routing problems on the Logistics & Dispatcher Team.",
  statement:
    "Previously, I’ve done research in combinatorial optimization (TSP, CVRP) and subgraph mining for optimal feature extraction. Broadly I enjoy working on any problem that requires me to actually think for long periods of time.",
  profileImage: "/profile.jpg",
  location: "Dhaka, Bangladesh",
  interestsStatement:
    "I’m currently drawn to theoretical computer science—especially randomness, graph algorithms, and algorithmic efficiency—and I stay curious about distributed systems and large-scale engineering.",
  socials: [
    { label: "GitHub", url: "https://github.com/vk1cd314", icon: "github" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/bholanath-das-niloy-084b68194/",
      icon: "linkedin",
    },
  ],
  researchInterests: [
    "Graph Algorithms & Randomness",
    "Subgraph Mining",
    "Distributed Systems",
  ],
};

export type Author = typeof author;
