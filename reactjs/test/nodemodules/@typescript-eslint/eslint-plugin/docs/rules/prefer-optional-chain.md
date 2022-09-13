---
description: 'Enforce using concise optional chain expressions instead of chained logical ands, negated logical ors, or empty objects.'
---

> 🛑 This file is source code, not the primary documentation location! 🛑
>
> See **https://typescript-eslint.io/rules/prefer-optional-chain** for documentation.

TypeScript 3.7 added support for the optional chain operator.
This operator allows you to safely access properties and methods on objects when they are potentially `null` or `undefined`.

```ts
type T = {
  a?: {
    b?: {
      c: string;
      method?: () => void;
    };
  };
};

function myFunc(foo: T | null) {
  return foo?.a?.b?.c;
}
// is roughly equivalent to
function myFunc(foo: T | null) {
  return foo && foo.a && foo.a.b && foo.a.b.c;
}
// or
function myFunc(foo: T | null) {
  return (((foo || {}).a || {}).b || {}).c;
}

function myFunc(foo: T | null) {
  return foo?.['a']?.b?.c;
}
// is roughly equivalent to
function myFunc(foo: T | null) {
  return foo && foo['a'] && foo['a'].b && foo['a'].b.c;
}

function myFunc(foo: T | null) {
  return foo?.a?.b?.method?.();
}
// is roughly equivalent to
function myFunc(foo: T | null) {
  return foo && foo.a && foo.a.b && foo.a.b.method && foo.a.b.method();
}
```

Because the optional chain operator _only_ chains when the property value is `null` or `undefined`, it is much safer than relying upon logical AND operator chaining `&&`; which chains on any _truthy_ value.

## Rule Details

This rule aims enforce the usage of the safer operator.

Examples of code for this rule:

<!--tabs-->

### ❌ Incorrect

```ts
foo && foo.a && foo.a.b && foo.a.b.c;
foo && foo['a'] && foo['a'].b && foo['a'].b.c;
foo && foo.a && foo.a.b && foo.a.b.method && foo.a.b.method();

// With empty objects
(((foo || {}).a || {}).b || {}).c;
(((foo || {})['a'] || {}).b || {}).c;

// With negated `or`s
!foo || !foo.bar;
!foo || !foo[bar];
!foo || !foo.bar || !foo.bar.baz || !foo.bar.baz();

// this rule also supports converting chained strict nullish checks:
foo &&
  foo.a != null &&
  foo.a.b !== null &&
  foo.a.b.c != undefined &&
  foo.a.b.c.d !== undefined &&
  foo.a.b.c.d.e;
```

### ✅ Correct

```ts
foo?.a?.b?.c;
foo?.['a']?.b?.c;
foo?.a?.b?.method?.();

foo?.a?.b?.c?.d?.e;

!foo?.bar;
!foo?.[bar];
!foo?.bar?.baz?.();
```

**Note:** there are a few edge cases where this rule will false positive. Use your best judgement when evaluating reported errors.

## When Not To Use It

If you are not using TypeScript 3.7 (or greater), then you will not be able to use this rule, as the operator is not supported.

## Further Reading

- [TypeScript 3.7 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html)
- [Optional Chaining Proposal](https://github.com/tc39/proposal-optional-chaining/)