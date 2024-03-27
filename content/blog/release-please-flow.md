---
draft: false
external: false
title: Release Management with Release-Please
description: A fast-tracked method to handle release management within your _Github_ repositories
date: 2024-03-27
---

## Problem Description

Whether you are developing an executable or library to be consumed by end-users, release management is a critical consideration from the inception of the project. Thankfully this is a well-defined problem within software projects and thus many established solutions exists. [SemVer](https://semver.org/) version tagging is a universally adopted standard by package managers, software tooling and authors to universally describe in a concise manner the impact of change. Integrating your release management within your day-to-day git flow is a massive automation win that brings reliability and consistency to your project. Open source tooling such as [release-please](https://github.com/googleapis/release-please) makes this easier than ever to incorporate release management in _all_ software projects you own.

## Release Please

Release-please integrates within your trunk-based git development flow relying on a specific commit message structure called [conventional-commits](https://www.conventionalcommits.org/) to automatically generate changelog release notes and make appropriate _semver_ bumps to your project version. 

The [release-please-actions](https://github.com/google-github-actions/release-please-action) _Github_ action makes this tooling easily accessible to you within your _Github_ repositories allowing you to seemlessly integrate _release-please_ within your established _continuious delivery_ pipeline.

## Quick Start Github Guide

Setup your release management such that it is managed through the `release-please-actions` utility. Ensure your respositories git flow is following the trunk-based development flow. There are a number of reasons to adopt this flow over other paradigms (see [here](https://trunkbaseddevelopment.com/branch-for-release/)).

Your `release-please.yml` workflow file might look something like this:

```yaml
on:
  push:
    branches:
      - default
name: release-please
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v4
        id: release
        with:
          release-type: node
      ...
```

Your deployment pipeline should be configured to trigger following the creation of a _[Github Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)_ thus isolating your path-to-production from any branch updates and instead establishing a dependency on changes in a release(s) _semver_.


### Supporting Multiple Releases

In a well established project, support for multiple releases or legacy version lifecycle support may be a priority. The basic setup above can be easily extended to offer this support.

Targetting a specific release-branch is simply introduced like so

```yaml
on:
  push:
    branches:
      - default
      - v1.x
      - v2.x
name: release-please
jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v4
        id: release
        with:
          release-type: node
          target-branch: ${{ github.ref_name }}
```

You can review the documentation of the [multiple releases](https://github.com/google-github-actions/release-please-action?tab=readme-ov-file#supporting-multiple-release-branches) `release-please-action` workflow yourself. An important consideration to be made is to ensure your CI/CD flow supports the core principles of [trunk-based](https://trunkbaseddevelopment.com/branch-for-release/) development. By that I emphasis the need to _squash-merge_ new features or bug fixes into the trunk or default branch with priority and then `git cherry-pick` any necessary legacy release branch fixes in order to ensure the trunk remains the _'most developed'_ of the commit branches.

## Handling Hotfixes

Once any new feature development on the trunk becomes too progressive for a particular release (i.e a major version `BREAKING_CHANGE` is introduced) a release branch should be established.

#### Creating the Release Branch

This is particularly easy using the `release-please-action` as you are able to setup an _action-step_ that updates the commit hash that a particular major version `git tag` is pointed to:

```yaml
...
    - uses: google-github-actions/release-please-action@v4
        id: release
        with:
            release-type: node
    ...
    - name: tag major and minor versions
        if: ${{ steps.release.outputs.release_created }}
        run: |
          git config user.name github-actions[bot]
          git config user.email 41898282+github-actions[bot]@users.noreply.github.com
          git tag -d v${{ steps.release.outputs.major }} || true
          git push origin :v${{ steps.release.outputs.major }} || true
          git tag -a v${{ steps.release.outputs.major }} -m "Release v${{ steps.release.outputs.major }}"
          git push origin v${{ steps.release.outputs.major }}
```

That way cutting a release branch is a piece of cake. Just reference the tag for the major version and create a release branch of the form `v[major-version].x`

```bash
git tag --list
git checkout [tag-name]
git checkout -b v[major-version].x
git push -u origin v[major-version].x
```

You'll need to ensure the appropriate _Github_ branch protection rules have been setup for this release branch. All other triggers based on a _Github release_ should work as usual.

#### Create the Release Branch Fix

Thus, in order to release a hotfix for a legacy major-version that is still in support, all you will have to do is follow the following process:

1. Reproduce the issue in the offending release _major_ version
2. Create a pull-request targetting the **trunk branch**
3. [git cherry-pick](https://git-scm.com/docs/git-cherry-pick) the fix to the relevant **release branch**
4. Resolve any merge conflicts and create a pull-request targetting the **release branch**
5. Following approval, allow `release-please` to manage the creation of an appropriate _semver_ release bump
6. Your deployment pipeline will be triggered and follow the necessary approval process to deploy the **release branch** hotfix.

## Conclusion

This is a fast-tracked method to handle release management within your _Github_ repositories. I recommend consulting the [release-please-action](https://github.com/google-github-actions/release-please-action) documentation as well as listed example repositories to gather further inspiration.