# Nonlinear MPC for Quadrupedal Loco-Manipulation

Source of the project page for

> **A Nonlinear MPC Framework for Loco-Manipulation of Quadrupedal Robots With Non-Negligible Manipulator Dynamics**
> Ruturaj S. Sambhus\*, Kapi Ketan Mehta\*, Ali MirMohammad Sadeghi\*, Basit Muhammad Imran, Jeeseop Kim, Taizoon Chunawala, Vittorio Pastore, Sujith Vijayan, Kaveh Akbari Hamed
> *IEEE Robotics and Automation Letters*, vol. 11, no. 4, pp. 4050–4057, 2026 (\* equal contribution)

[**Code**](https://github.com/HDSRL/Locomanipulation_NMPC_Go2_Kinova) ·
[Project page](https://ruturajsambhusvt.github.io/RAL_locomanip/) ·
[Paper](https://doi.org/10.1109/LRA.2026.3664229) ·
[Accepted PDF](https://hdl.handle.net/10919/141324) ·
[arXiv](https://arxiv.org/abs/2507.22042) ·
[Video](https://youtu.be/SaZMqanFWv0)

The NMPC couples a single-rigid-body locomotion template with the full-order dynamics of a 4-DoF Kinova arm through rigid holonomic constraints. It solves for base motion, ground reaction forces, arm torques and the interaction wrench at 60 Hz. A QP-based whole-body controller tracks the locomotion plan at 500 Hz.

## Code

The controller is at [HDSRL/Locomanipulation_NMPC_Go2_Kinova](https://github.com/HDSRL/Locomanipulation_NMPC_Go2_Kinova) (GPL-3.0). Please open code issues there.

This repository holds only the website, in `docs/`, served by GitHub Pages.

## Citation

```bibtex
@article{sambhus2026nmpc,
  author  = {Sambhus, Ruturaj S. and Mehta, Kapi Ketan and
             Sadeghi, Ali MirMohammad and Imran, Basit Muhammad and
             Kim, Jeeseop and Chunawala, Taizoon and
             Pastore, Vittorio and Vijayan, Sujith and
             Akbari Hamed, Kaveh},
  title   = {A Nonlinear {MPC} Framework for Loco-Manipulation of
             Quadrupedal Robots With Non-Negligible Manipulator Dynamics},
  journal = {IEEE Robotics and Automation Letters},
  volume  = {11},
  number  = {4},
  pages   = {4050--4057},
  year    = {2026},
  doi     = {10.1109/LRA.2026.3664229}
}
```

## Acknowledgment

The work of R. S. Sambhus, S. Vijayan and K. Akbari Hamed is partially supported by the National Science Foundation under Grant 2423725.
