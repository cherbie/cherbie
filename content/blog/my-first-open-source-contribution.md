---
draft: false
external: false
title: My First Open-Source Contribution
description: A guide to submitting your first open-source contribution
date: 2024-04-04
---

> TLDR; it wasn’t that scary and well-natured people want you to succeed.

Your first commit to an open-source repository can be a bit daunting. Specially considering quite a bit of respect and adoration is held for the maintainers of these repositories particularly in the eyes of someone junior or lacking confidence. 

The good news is, confidence can be built!

## Finding your entry point

Before you start learning to swim freestyle, you need to get used to the feeling of the water. There is a pattern to open-source contributions that can be easily learnt. The best way to learn is by doing.

You want to identify an approachable issue. Keep your eye out on for the `good first issue` labels and don’t be scared to fork the repository and solve the problem. Most established projects have a `CONTRIBUTING` guide and if not, apply similar concepts from the `CONTRIBUTING` guide of a well structured, established repository and go from there. 

## Committing Your Code

This should be a little more familiar to you. Your standard git-flow is followed and there is no concern about introducing conflicts considering the forked repository is completely isolated/sand-boxed from the original repository.

> You can experiment as much as you would like.

### My experience

I saw an opportunity in an issue to add an additional parameter to a function that allowed you to configure the `hostname` of a FTP server.

This was a very easy feature request to implement, considering its absence only resulted from the maintainers making an assumption to always target the `0.0.0.0` IP address. That address plays very well within containerized applications like `containerd` or `docker` due to the `hostnames` insignificance and heavy reliance instead of exposing particular `port(s)` for connecting services.

What about the `localhost` case or other use cases?

There wasn’t really support for this case and someone wanted that support. And so I forked the repository and wrote something like

```cpp
void listen(std::string hostname, int port) {
	...
}
```

Those that are quick to spot the issue, bare with me…

## Creating Your Pull-Request

Once you are happy with your contribution, create a pull-request targeting the *default* branch or a *specific release* branch. The pull-request review process is similar to any professional review process. Most established projects are maintained by developers working for larger organizations after all. Generally projects have a more relaxed feel, particularly hobbyist projects.

Either way constructive feedback results in better outcomes for all so that is the *bare-minimum expectation* from the maintainers’ and the contributors’ perspective. Take onboard feedback and action on the feedback as required.

Otherwise your job is done. It is now up to the maintainer to manage how the contribution fits into their *release-cycle* and how the contribution helps push the repository in the direction of the project roadmap.

### My Experience

The reason I even stumbled across the project is because I only really had university level experience with C/C++ and I was curious as to how real-world applications were structured, built and deployed in this ecosystem. I wasn’t overly familiar with *[C++ Core Guidelines](http://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)* and hence what was considered best-practice.

I am very grateful to the maintainer of this project as they provided a constructive review that introduced me to the above concepts. The fix was the following

```cpp
void listen(const std::string &hostname, int port) {
	...
}
```

I immediately learnt about `const` [references](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md) in *C++* and their utility with data structures where *copying* may be expensive. This feedback also sent me down a path of further learning for which I am very grateful.

I would like to think maybe the workload was *slightly* reduced for the maintainer although the fix really didn’t ask for much. If not, they can at least find comfort in making a positive contribution towards the life of someone else 🤷‍♂️.

## The Takeaway

Give it a go. Most of the time something positive is generated through the interaction whether it is reducing the burden for someone else or through learning outcomes. As with most things, it only gets easier the more you do it.