/** @type {import('postcss')} */
const postcss = require("postcss");
const makeDecl = postcss.decl;
const makeRule = postcss.rule;
const atRule = postcss.atRule;

/** @type {import('postcss').PluginCreator} */
module.exports = () => {
  let count = 0;
  const uuid = () => `logical-polyfill-${count++}`;

  const rtlSelectors = ['[dir="rtl"]'];
  const ltrSelectors = ['[dir="ltr"]', 'html:not([dir="rtl"])'];
  /** @type {Array<{prop: string, value: string}>} */
  const variablesForProperties = [];
  /** @type {Array<string>} */
  const resetVars = [];

  /**
   * The oldest supported versions of Chrome only supported:
   * - -webkit-margin-start, -webkit-margin-end
   * - -webkit-padding-start, -webkit-padding-end
   * - -webkit-border-start-*, -webkit-border-end-*
   *
   * Chrome 69-88 only supports:
   * - margin-inline-start, margin-inline-end
   * - padding-inline-start, padding-inline-end
   * - border-inline-start-*, border-inline-end-*
   *
   * The lowest supported version of Firefox supports:
   * - margin-inline-start, margin-inline-end
   * - padding-inline-start, padding-inline-end
   * - border-inline-start-*, border-inline-end-*
   */

  return {
    postcssPlugin: "postcss-logical-property-polyfill",

    OnceExit(css) {
      css.prepend(
        makeRule({
          selector: "*",
          nodes: resetVars.map((prop) =>
            makeDecl({ prop: `${prop}`, value: "initial" })
          ),
        }),
        makeRule({
          selectors: ltrSelectors,
          nodes: [
            makeDecl({ prop: "--is-ltr", value: "1" }),
            makeDecl({ prop: "--is-rtl", value: "0" }),
            makeDecl({ prop: "--start", value: "left" }),
            makeDecl({ prop: "--end", value: "right" }),
            makeDecl({ prop: "--inline-unit", value: "1" }),
            ...variablesForProperties.map(({ prop, value }) =>
              makeDecl({ prop: `${prop}-ltr`, value })
            ),
            ...variablesForProperties.map(({ prop }) =>
              makeDecl({ prop: `${prop}-rtl`, value: "initial" })
            ),
          ],
        }),
        makeRule({
          selectors: rtlSelectors,
          nodes: [
            makeDecl({ prop: "--is-ltr", value: "0" }),
            makeDecl({ prop: "--is-rtl", value: "1" }),
            makeDecl({ prop: "--start", value: "right" }),
            makeDecl({ prop: "--end", value: "left" }),
            makeDecl({ prop: "--inline-unit", value: "-1" }),
            ...variablesForProperties.map(({ prop }) =>
              makeDecl({ prop: `${prop}-ltr`, value: "initial" })
            ),
            ...variablesForProperties.map(({ prop, value }) =>
              makeDecl({ prop: `${prop}-rtl`, value })
            ),
          ],
        })
      );
    },

    Declaration: {
      "margin-inline": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "margin-inline-start", value }),
          makeDecl({ prop: "margin-inline-end", value }),
          decl
        );
      },
      "margin-block": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "margin-top", value }),
          makeDecl({ prop: "margin-bottom", value }),
          decl
        );
      },
      "margin-inline-start": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-margin-start", value }),
          decl
        );
      },
      "margin-inline-end": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "-webkit-margin-end", value }), decl);
      },
      "margin-block-start": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "margin-top", value }), decl);
      },
      "margin-block-end": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "margin-bottom", value }), decl);
      },
      "padding-inline": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "padding-inline-start", value }),
          makeDecl({ prop: "padding-inline-end", value }),
          decl
        );
      },
      "padding-block": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "padding-top", value }),
          makeDecl({ prop: "padding-bottom", value }),
          decl
        );
      },
      "padding-inline-start": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-padding-start", value }),
          decl
        );
      },
      "padding-inline-end": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-padding-end", value }),
          decl
        );
      },
      "padding-block-start": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "padding-top", value }), decl);
      },
      "padding-block-end": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "padding-bottom", value }), decl);
      },
      "border-inline": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-inline-start", value }),
          makeDecl({ prop: "border-inline-end", value }),
          decl
        );
      },
      "border-block": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-top", value }),
          makeDecl({ prop: "border-bottom", value }),
          decl
        );
      },
      "border-block-start": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "border-top", value }), decl);
      },
      "border-block-end": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "border-bottom", value }), decl);
      },
      "border-inline-start": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-border-start", value }),
          decl
        );
      },
      "border-inline-end": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "-webkit-border-end", value }), decl);
      },
      "border-inline-width": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-inline-start-width", value }),
          makeDecl({ prop: "border-inline-end-width", value }),
          decl
        );
      },
      "border-inline-start-width": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-border-start-width", value }),
          decl
        );
      },
      "border-inline-end-width": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-border-end-width", value }),
          decl
        );
      },
      "border-inline-style": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-inline-start-style", value }),
          makeDecl({ prop: "border-inline-end-style", value }),
          decl
        );
      },
      "border-inline-start-style": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-border-start-style", value }),
          decl
        );
      },
      "border-inline-end-style": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-border-end-style", value }),
          decl
        );
      },
      "border-inline-color": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-inline-start-color", value }),
          makeDecl({ prop: "border-inline-end-color", value }),
          decl
        );
      },
      "border-inline-start-color": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-border-start-color", value }),
          decl
        );
      },
      "border-inline-end-color": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "-webkit-border-end-color", value }),
          decl
        );
      },
      "border-block-width": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-top-width", value }),
          makeDecl({ prop: "border-bottom-width", value }),
          decl
        );
      },
      "border-block-start-width": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "border-top-width", value }), decl);
      },
      "border-block-end-width": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-bottom-width", value }),
          decl
        );
      },
      "border-block-style": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-top-style", value }),
          makeDecl({ prop: "border-bottom-style", value }),
          decl
        );
      },
      "border-block-start-style": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "border-top-style", value }), decl);
      },
      "border-block-end-style": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-bottom-style", value }),
          decl
        );
      },
      "border-block-color": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-top-color", value }),
          makeDecl({ prop: "border-bottom-color", value }),
          decl
        );
      },
      "border-block-start-color": (decl) => {
        const value = decl.value;

        decl.replaceWith(makeDecl({ prop: "border-top-color", value }), decl);
      },
      "border-block-end-color": (decl) => {
        const value = decl.value;

        decl.replaceWith(
          makeDecl({ prop: "border-bottom-color", value }),
          decl
        );
      },
      "inset-inline": (decl) => {
        const value = decl.value;
        const rule = decl.parent;

        rule.replaceWith(
          atRule({
            name: "supports",
            params: "not (inset-inline: 0)",
            nodes: [
              makeRule({
                selector: rule.selector,
                nodes: [
                  makeDecl({ prop: "left", value }),
                  makeDecl({ prop: "right", value }),
                ],
              }),
            ],
          }),
          rule
        );
      },
      "inset-block": (decl) => {
        const value = decl.value;
        const rule = decl.parent;

        rule.replaceWith(
          atRule({
            name: "supports",
            params: "not (inset-block: 0)",
            nodes: [
              makeRule({
                selector: rule.selector,
                nodes: [
                  makeDecl({ prop: "top", value }),
                  makeDecl({ prop: "bottom", value }),
                ],
              }),
            ],
          }),
          rule
        );
      },
      "inset-inline-start": (decl) => {
        const value = decl.value;
        /** @type {require("postcss").Rule} */
        const rule = decl.parent;
        const varName = uuid();

        variablesForProperties.push({ prop: `--${varName}`, value });
        resetVars.push("--x-inset-inline-start");

        rule.replaceWith(
          atRule({
            name: "supports",
            params: "not (inset-inline-start: 0)",
            nodes: [
              makeRule({
                selector: rule.selector,
                nodes: [
                  makeDecl({ prop: "--x-inset-inline-start", value }),
                  makeDecl({
                    prop: "left",
                    value: `var(--${varName}-ltr, var(--x-inset-inline-end))`,
                  }),
                  makeDecl({
                    prop: "right",
                    value: `var(--${varName}-rtl, var(--x-inset-inline-end))`,
                  }),
                ],
              }),
            ],
          }),
          rule
        );
      },
      "inset-inline-end": (decl) => {
        const value = decl.value;
        /** @type {require("postcss").Rule} */
        const rule = decl.parent;
        const varName = uuid();

        variablesForProperties.push({ prop: `--${varName}`, value });
        resetVars.push("--x-inset-inline-end");

        rule.replaceWith(
          atRule({
            name: "supports",
            params: "not (inset-inline-end: 0)",
            nodes: [
              makeRule({
                selector: rule.selector,
                nodes: [
                  makeDecl({ prop: "--x-inset-inline-end", value }),
                  makeDecl({
                    prop: "left",
                    value: `var(--${varName}-rtl, var(--x-inset-inline-start))`,
                  }),
                  makeDecl({
                    prop: "right",
                    value: `var(--${varName}-ltr, var(--x-inset-inline-start))`,
                  }),
                ],
              }),
            ],
          }),
          rule
        );
      },
      "border-start-start-radius": (decl) => {
        const value = decl.value;
        /** @type {require("postcss").Rule} */
        const rule = decl.parent;
        const varName = uuid();

        variablesForProperties.push({ prop: `--${varName}`, value });
        resetVars.push("--x-border-start-start-radius");

        rule.replaceWith(
          atRule({
            name: "supports",
            params: "not (border-start-start-radius: 0)",
            nodes: [
              makeRule({
                selector: rule.selector,
                nodes: [
                  makeDecl({ prop: "--x-border-start-start-radius", value }),
                  makeDecl({
                    prop: "border-top-left-radius",
                    value: `var(--${varName}-ltr, var(--x-border-start-end-radius))`,
                  }),
                  makeDecl({
                    prop: "border-top-right-radius",
                    value: `var(--${varName}-rtl, var(--x-border-start-end-radius))`,
                  }),
                ],
              }),
            ],
          }),
          rule
        );
      },
      "border-start-end-radius": (decl) => {
        const value = decl.value;
        /** @type {require("postcss").Rule} */
        const rule = decl.parent;
        const varName = uuid();

        variablesForProperties.push({ prop: `--${varName}`, value });
        resetVars.push("--x-border-start-end-radius");

        rule.replaceWith(
          atRule({
            name: "supports",
            params: "not (border-start-end-radius: 0)",
            nodes: [
              makeRule({
                selector: rule.selector,
                nodes: [
                  makeDecl({ prop: "--x-border-start-end-radius", value }),
                  makeDecl({
                    prop: "border-top-left-radius",
                    value: `var(--${varName}-rtl, var(--x-border-start-start-radius))`,
                  }),
                  makeDecl({
                    prop: "border-top-right-radius",
                    value: `var(--${varName}-ltr, var(--x-border-start-start-radius))`,
                  }),
                ],
              }),
            ],
          }),
          rule
        );
      },
      "border-end-start-radius": (decl) => {
        const value = decl.value;
        /** @type {require("postcss").Rule} */
        const rule = decl.parent;
        const varName = uuid();

        variablesForProperties.push({ prop: `--${varName}`, value });
        resetVars.push("--x-border-end-start-radius");

        rule.replaceWith(
          atRule({
            name: "supports",
            params: "not (border-end-start-radius: 0)",
            nodes: [
              makeRule({
                selector: rule.selector,
                nodes: [
                  makeDecl({ prop: "--x-border-end-start-radius", value }),
                  makeDecl({
                    prop: "border-bottom-left-radius",
                    value: `var(--${varName}-ltr, var(--x-border-end-end-radius))`,
                  }),
                  makeDecl({
                    prop: "border-bottom-right-radius",
                    value: `var(--${varName}-rtl, var(--x-border-end-end-radius))`,
                  }),
                ],
              }),
            ],
          }),
          rule
        );
      },
      "border-end-end-radius": (decl) => {
        const value = decl.value;
        /** @type {require("postcss").Rule} */
        const rule = decl.parent;
        const varName = uuid();

        variablesForProperties.push({ prop: `--${varName}`, value });
        resetVars.push("--x-border-end-end-radius");

        rule.replaceWith(
          atRule({
            name: "supports",
            params: "not (border-end-end-radius: 0)",
            nodes: [
              makeRule({
                selector: rule.selector,
                nodes: [
                  makeDecl({ prop: "--x-border-end-end-radius", value }),
                  makeDecl({
                    prop: "border-bottom-left-radius",
                    value: `var(--${varName}-rtl, var(--x-border-end-start-radius))`,
                  }),
                  makeDecl({
                    prop: "border-bottom-right-radius",
                    value: `var(--${varName}-ltr, var(--x-border-end-start-radius))`,
                  }),
                ],
              }),
            ],
          }),
          rule
        );
      },
      direction: (decl) => {
        const value = decl.value;
        /** @type {require("postcss").Rule} */
        const rule = decl.parent;
        if (value === "ltr") {
          ltrSelectors.push(rule.selector);
        }
        if (value === "rtl") {
          rtlSelectors.push(rule.selector);
        }
      },
    },
  };
};

module.exports.postcss = true;
