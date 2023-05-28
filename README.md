# postcss-logical-property-polyfill

[PostCSS] plugin that will polyfill inset-inline-(start|end) and border-(start|end)-(start|end)-radius in older browsers that don't support them. The polyfill works by leveraging CSS variables, and works for sub-trees and not just globally..

[postcss]: https://github.com/postcss/postcss

### Vendor Prefixes for `margin`, `padding` and `border`

Input:

```css
.foo {
  margin-inline-start: 10px;
}
```

Output:

```css
.foo {
  -webkot-margin-start: 10px;
  margin-inline-start: 10px;
}
```

### CSS variable based polyfill for `inset-inline` and `border-radius`

Input:

```css
.foo {
  inset-inline-end: 10px;
}
.bar {
  inset-inline-start: 5px;
}
```

Output:

```css
* {
  --x-inset-inline-end: initial;
  --x-inset-inline-start: initial;
}
[dir="ltr"],
html:not([dir="rtl"]) {
  --logical-polyfill-0-ltr: 10px;
  --logical-polyfill-1-ltr: 5px;
  --logical-polyfill-0-rtl: initial;
  --logical-polyfill-1-rtl: initial;
}
[dir="rtl"] {
  --logical-polyfill-0-ltr: initial;
  --logical-polyfill-1-ltr: initial;
  --logical-polyfill-0-rtl: 10px;
  --logical-polyfill-1-rtl: 5px;
}
@supports not (inset-inline-end: 0) {
  .foo {
    --x-inset-inline-end: 10px;
    left: var(--logical-polyfill-0-rtl, var(--x-inset-inline-start));
    right: var(--logical-polyfill-0-ltr, var(--x-inset-inline-start));
  }
}
.foo {
  inset-inline-end: 10px;
}
@supports not (inset-inline-start: 0) {
  .bar {
    --x-inset-inline-start: 5px;
    left: var(--logical-polyfill-1-ltr, var(--x-inset-inline-end));
    right: var(--logical-polyfill-1-rtl, var(--x-inset-inline-end));
  }
}
.bar {
  inset-inline-start: 5px;
}
```

#### How does this actually work?

Whenever you use `inset-inline-(start|end)` or `border-(start|end)-(start|end)-radius`, a pair of CSS variables are generated
`--var-name-ltr` and `--var-name-rtl`. Based on the current writing mode, only one of these two variables will ever have a value.

Then we can simply use _both_ the physical properties with the respective variables and get the desired result:

```css
left: var(
  --logical-polyfill-1-ltr
); /* Has an effect in LTR only, the variable is "undefined" in RTL */
right: var(
  --logical-polyfill-1-rtl
); /* Has an effect in RTL only, the variable is "undefined" in LTR */
```

However, this limits us to having a value for just ONE of the two sides. "left" or "right", but not both.

In order to be able to support `inset-inline-start` **and** `inset-inline-end` we need a fallback CSS variable for the values.

```css
/* inset-inline-start: */
--inset-inline-start: 10px;
left: var(
  --logical-polyfill-1-ltr,
  var(--inset-inline-end)
); /* this property is overridden and has no effect */
right: var(
  --logical-polyfill-1-rtl,
  var(--inset-inline-end)
); /* this property is overridden and has no effect */

/* inset-inline-end: */
--inset-inline-end: 10px;
left: var(--logical-polyfill-2-rtl, var(--inset-inline-start));
/* In RTL, it takes the first value, in LTR, it takes the second value */
right: var(--logical-polyfill-2-ltr, var(--inset-inline-start));
/* In LTR, it takes the first value, in RTL, it takes the second value */
```

### Additional Utility CSS variables available:

In addition to the CSS variables generated for `inset-inline-(start|end)` properties,
a few CSS variables are always injected that can be used in-place of "logical" values.

```css
[dir="ltr"],
html:not([dir="rtl"]) {
  --is-ltr: 1;
  --is-rtl: 0;
  --start: left;
  --end: right;
  --inline-unit: 1;
}
[dir="rtl"] {
  --is-ltr: 0;
  --is-rtl: 1;
  --start: right;
  --end: left;
  --inline-unit: -1;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-logical-property-polyfill
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-logical-property-polyfill'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
