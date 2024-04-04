---
draft: false
external: false
title: Robust Domain Typing in Typescript
description: How to improve your domain types in typescript
date: 2024-03-26

---

## Introduction

The ambiguous nature of JavaScript is a well-documented phenomenon that can cause either hysterical laughter or tears streaming down your face. *TypeScript* is depicted as the knight in shining armor however, due to its static type checking nature and transpiled makeup, its utility can easily be lost through developer carelessness. If you have ever found yourself littering your code with type casts (`as ...`)  or handling the construction of nested objects from weakly typed objects using ternary operators (`?`) or default spread objects (`...`) , know that there is a better way.

## Domain Driven Development

I won't discuss the intricacies of *domain driven development* (*DDD*) in this blog post however in `es6` based applications, *DDD* often manifests itself into the following folder structure:

```
/src
    /api
    /domain
    /routes
    /types
```

As you can see, types that reflect application or domain-wide concepts are captured at the root level in the `/types` folder. Because the scope of these types is across the entire application domain, naturally they experience a lot of referencing and reuse. The global types define the source code's understanding of _“the domain”_.

Another general categorization for *types* are privately scoped *types* to a *module or file*. The defining characteristic of this type scope is their lack of referencing outside of the scope of a *module*. These often blossom around functions with targeted functionality like API fetch utilities or function props.

> Note: I purposely allow for leniency by referencing a module rather than a singular file since you can make use of the automatic resolution of an index.ts file to encapsulate nested files in a folder and expose these as a module through selective export(s).

As an example, these two generalized categories of *types* generally interact with each other by

1. An API utility getter function encapsulating the REST API schema via some `type` definition.
2. A *domain abstraction function* mangling an API response into a *global domain type*.
3. The controller referencing this *domain abstraction function* to construct the outward facing API response (a *privately scoped* type).

## My Experience

In my experience, I have found developers making excellent use of *object schema validation* tools such as [Yup](https://github.com/jquense/yup) or [Joi](https://joi.dev/) near *user interaction handling* functions. Examples include API utility functions, REST server request handling functions. This is certainly a well-defined and common use case for such tooling but can we go further?

Introduce the `/schema` folder to encapsulate and simplify the mangling of data into *domain types* by condensing edge cases through well-defined *builder functions* provided by the schema validation libraries.

```
/src
    /api
    /domain
    /schema
    /types
```

If you initially squirm at this proposition, bare with me and consider these side effects.

### Closing The Typing Gap

One of the major benefits of the builder functions is the ability to `InferType<T>` from the output. Instead of declaring an `object` and `type` in isolation and then relating them in code with `const myObject: MyType = {}` you can define the validation schema and infer the type from there:

```ts
const schema = yup.object().shape({})
type Schema = yup.InferType<typeof schema>
```

The issue with isolated type declarations is that when making changes to either the `object` or the `type`, sweeping changes across the repository are expected. In the worst case this does not happen due to developer error. As the size of a repository increases the likelihood of this occurring grows exponentially with the number of `object <-> type` references.

However, when utilizing derived typing, changes made to the schema that reflect a new feature/bug are immediately cascaded across the repository without having to implement a similar change in two places (at best).

Of course there are other engineering practices like code reviews, unit tests and end-to-end tests that will likely provide feedback on such an error. Any code change that tightens this feedback loop is a win in my books.

## Considerations

The one consideration to be made with such an approach is obviously the overhead that is inevitably associated with the additional validation run by tools such as [Yup](https://github.com/jquense/yup) or [Joi](https://joi.dev/). It would clearly not make sense to apply such a technique to naive object construction. However, there definitely exists a tipping point where factors such as *maintainability*, *security*, and *testability* influence your resulting decision.

The major benefit of the technique highlighted isn’t solely in the genius of some magical validation library.  That is far from the truth. Rather, it is instead the design pattern such a library encourages; namely the [factory pattern](https://en.wikipedia.org/wiki/Factory_method_pattern). So during the construction of naive objects consider the value in sticking to software design first-principles and looking for opportunities to implement these patterns in your code.

## Conclusion

I have shared techniques I have tried and tested within a number of software projects that have allowed me to de-clutter my typescript codebase as well as improve the legibility and hence maintainability of the code. It has allowed teammates to better collaborate on the projects and it has worked to reduce the burden of the code review process.