const postcss = require("postcss");

const plugin = require("./");

function removeIndentation(str) {
  return str
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

const defaultGlobals = `
* {}
[dir="ltr"], html:not([dir="rtl"]) {
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
`;

async function run(input, output, opts = {}, overrideGlobal = defaultGlobals) {
  let result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });
  expect(removeIndentation(result.css)).toEqual(
    removeIndentation(overrideGlobal + "\n" + output)
  );
  expect(result.warnings()).toHaveLength(0);
}

describe("margins", () => {
  it("Polyfills margin-inline", async () => {
    await run(
      `
      .foo {
        margin-inline: 10px;
      }
      `,
      `
      .foo {
        -webkit-margin-start: 10px;
        margin-inline-start: 10px;
        -webkit-margin-end: 10px;
        margin-inline-end: 10px;
        margin-inline: 10px;
      }
      `
    );
  });

  it("Polyfills margin-block", async () => {
    await run(
      `
      .foo {
        margin-block: 10px;
      }
      `,
      `
      .foo {
        margin-top: 10px;
        margin-bottom: 10px;
        margin-block: 10px;
      }
      `
    );
  });

  it("Polyfills margin-block-start", async () => {
    await run(
      `
      .foo {
        margin-block-start: 10px;
      }
      `,
      `
      .foo {
        margin-top: 10px;
        margin-block-start: 10px;
      }
      `
    );
  });

  it("Polyfills margin-block-end", async () => {
    await run(
      `
      .foo {
        margin-block-end: 10px;
      }
      `,
      `
      .foo {
        margin-bottom: 10px;
        margin-block-end: 10px;
      }
      `
    );
  });

  it("Polyfills margin-inline-start", async () => {
    await run(
      `
      .foo {
        margin-inline-start: 10px;
      }
      `,
      `
      .foo {
        -webkit-margin-start: 10px;
        margin-inline-start: 10px;
      }
      `
    );
  });
  it("Polyfills margin-inline-end", async () => {
    await run(
      `
      .foo {
        margin-inline-end: 10px;
      }
      `,
      `
      .foo {
        -webkit-margin-end: 10px;
        margin-inline-end: 10px;
      }
      `
    );
  });
  it("Polyfills margin-block-start", async () => {
    await run(
      `
      .foo {
        margin-block-start: 10px;
      }
      `,
      `
      .foo {
        margin-top: 10px;
        margin-block-start: 10px;
      }
      `
    );
  });
});

describe("padding", () => {
  it("Polyfills padding-inline", async () => {
    await run(
      `
      .foo {
        padding-inline: 10px;
      }
      `,
      `
      .foo {
        -webkit-padding-start: 10px;
        padding-inline-start: 10px;
        -webkit-padding-end: 10px;
        padding-inline-end: 10px;
        padding-inline: 10px;
      }
      `
    );
  });

  it("Polyfills padding-block", async () => {
    await run(
      `
      .foo {
        padding-block: 10px;
      }
      `,
      `
      .foo {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-block: 10px;
      }
      `
    );
  });

  it("Polyfills padding-inline-start", async () => {
    await run(
      `
      .foo {
        padding-inline-start: 10px;
      }
      `,
      `
      .foo {
        -webkit-padding-start: 10px;
        padding-inline-start: 10px;
      }
      `
    );
  });
  it("Polyfills padding-inline-end", async () => {
    await run(
      `
      .foo {
        padding-inline-end: 10px;
      }
      `,
      `
      .foo {
        -webkit-padding-end: 10px;
        padding-inline-end: 10px;
      }
      `
    );
  });
  it("Polyfills padding-block-start", async () => {
    await run(
      `
      .foo {
        padding-block-start: 10px;
      }
      `,
      `
      .foo {
        padding-top: 10px;
        padding-block-start: 10px;
      }
      `
    );
  });
});

describe("border", () => {
  describe("shorthands", () => {
    it("Polyfills border-inline", async () => {
      await run(
        `
          .foo {
            border-inline: 10px solid red;
          }
          `,
        `
          .foo {
            -webkit-border-start: 10px solid red;
            border-inline-start: 10px solid red;
            -webkit-border-end: 10px solid red;
            border-inline-end: 10px solid red;
            border-inline: 10px solid red;
          }
          `
      );
    });

    it("Polyfills border-block", async () => {
      await run(
        `
          .foo {
            border-block: 10px solid red;
          }
          `,
        `
          .foo {
            border-top: 10px solid red;
            border-bottom: 10px solid red;
            border-block: 10px solid red;
          }
          `
      );
    });

    it("Polyfills border-inline-start", async () => {
      await run(
        `
          .foo {
            border-inline-start: 10px solid red;
          }
          `,
        `
          .foo {
            -webkit-border-start: 10px solid red;
            border-inline-start: 10px solid red;
          }
          `
      );
    });
    it("Polyfills border-inline-end", async () => {
      await run(
        `
          .foo {
            border-inline-end: 10px solid red;
          }
          `,
        `
          .foo {
            -webkit-border-end: 10px solid red;
            border-inline-end: 10px solid red;
          }
          `
      );
    });
    it("Polyfills border-block-start", async () => {
      await run(
        `
          .foo {
            border-block-start: 10px solid red;
          }
          `,
        `
          .foo {
            border-top: 10px solid red;
            border-block-start: 10px solid red;
          }
          `
      );
    });
  });

  describe("widths", () => {
    it("Polyfills border-inline-width", async () => {
      await run(
        `
          .foo {
            border-inline-width: 10px;
          }
          `,
        `
          .foo {
            -webkit-border-start-width: 10px;
            border-inline-start-width: 10px;
            -webkit-border-end-width: 10px;
            border-inline-end-width: 10px;
            border-inline-width: 10px;
          }
          `
      );
    });

    it("Polyfills border-block", async () => {
      await run(
        `
          .foo {
            border-block-width: 10px;
          }
          `,
        `
          .foo {
            border-top-width: 10px;
            border-bottom-width: 10px;
            border-block-width: 10px;
          }
          `
      );
    });

    it("Polyfills border-inline-start", async () => {
      await run(
        `
          .foo {
            border-inline-start-width: 10px;
          }
          `,
        `
          .foo {
            -webkit-border-start-width: 10px;
            border-inline-start-width: 10px;
          }
          `
      );
    });
    it("Polyfills border-inline-end", async () => {
      await run(
        `
          .foo {
            border-inline-end-width: 10px;
          }
          `,
        `
          .foo {
            -webkit-border-end-width: 10px;
            border-inline-end-width: 10px;
          }
          `
      );
    });
    it("Polyfills border-block-start", async () => {
      await run(
        `
          .foo {
            border-block-start-width: 10px;
          }
          `,
        `
          .foo {
            border-top-width: 10px;
            border-block-start-width: 10px;
          }
          `
      );
    });
  });

  describe("styles", () => {
    it("Polyfills border-inline-color", async () => {
      await run(
        `
          .foo {
            border-inline-color: red;
          }
          `,
        `
          .foo {
            -webkit-border-start-color: red;
            border-inline-start-color: red;
            -webkit-border-end-color: red;
            border-inline-end-color: red;
            border-inline-color: red;
          }
          `
      );
    });

    it("Polyfills border-block", async () => {
      await run(
        `
          .foo {
            border-block-style: solid;
          }
          `,
        `
          .foo {
            border-top-style: solid;
            border-bottom-style: solid;
            border-block-style: solid;
          }
          `
      );
    });

    it("Polyfills border-inline-start", async () => {
      await run(
        `
          .foo {
            border-inline-start-style: solid;
          }
          `,
        `
          .foo {
            -webkit-border-start-style: solid;
            border-inline-start-style: solid;
          }
          `
      );
    });
    it("Polyfills border-inline-end", async () => {
      await run(
        `
          .foo {
            border-inline-end-style: solid;
          }
          `,
        `
          .foo {
            -webkit-border-end-style: solid;
            border-inline-end-style: solid;
          }
          `
      );
    });
    it("Polyfills border-block-start", async () => {
      await run(
        `
          .foo {
            border-block-start-style: solid;
          }
          `,
        `
          .foo {
            border-top-style: solid;
            border-block-start-style: solid;
          }
          `
      );
    });
  });

  describe("colors", () => {
    it("Polyfills border-inline-color", async () => {
      await run(
        `
          .foo {
            border-inline-color: red;
          }
          `,
        `
          .foo {
            -webkit-border-start-color: red;
            border-inline-start-color: red;
            -webkit-border-end-color: red;
            border-inline-end-color: red;
            border-inline-color: red;
          }
          `
      );
    });

    it("Polyfills border-block", async () => {
      await run(
        `
          .foo {
            border-block-color: red;
          }
          `,
        `
          .foo {
            border-top-color: red;
            border-bottom-color: red;
            border-block-color: red;
          }
          `
      );
    });

    it("Polyfills border-inline-start", async () => {
      await run(
        `
          .foo {
            border-inline-start-color: red;
          }
          `,
        `
          .foo {
            -webkit-border-start-color: red;
            border-inline-start-color: red;
          }
          `
      );
    });
    it("Polyfills border-inline-end", async () => {
      await run(
        `
          .foo {
            border-inline-end-color: red;
          }
          `,
        `
          .foo {
            -webkit-border-end-color: red;
            border-inline-end-color: red;
          }
          `
      );
    });
    it("Polyfills border-block-start", async () => {
      await run(
        `
          .foo {
            border-block-start-color: red;
          }
          `,
        `
          .foo {
            border-top-color: red;
            border-block-start-color: red;
          }
          `
      );
    });
  });
});

describe("inset-inline", () => {
  it("Polyfills inset-inline", async () => {
    await run(
      `
        .foo {
          inset-inline: 10px;
        }
      `,
      `
        @supports not (inset-inline: 0) {
          .foo {
            left: 10px;
            right: 10px;
          }
        }
        .foo {
          inset-inline: 10px;
        }
      `
    );
  });
  it("Polyfills inset-inline-start", async () => {
    await run(
      `
        .foo {
          inset-inline-start: 10px;
        }
      `,
      `
        @supports not (inset-inline-start: 0) {
          .foo {
            --x-inset-inline-start: 10px;
            left: var(--foo-ltr, var(--x-inset-inline-end));
            right: var(--foo-rtl, var(--x-inset-inline-end));
          }
        }
        .foo {
          inset-inline-start: 10px;
        }
      `,
      {},
      `
        * {
          --x-inset-inline-start: initial;
        }
        [dir="ltr"], html:not([dir="rtl"]) {
          --is-ltr: 1;
          --is-rtl: 0;
          --start: left;
          --end: right;
          --inline-unit: 1;
          --foo-ltr: 10px;
          --foo-rtl: initial;
        }
        [dir="rtl"] {
          --is-ltr: 0;
          --is-rtl: 1;
          --start: right;
          --end: left;
          --inline-unit: -1;
          --foo-ltr: initial;
          --foo-rtl: 10px;
        }
      `
    );
  });
  it("Polyfills inset-inline-end", async () => {
    await run(
      `
        .foo {
          inset-inline-end: 10px;
        }
      `,
      `
        @supports not (inset-inline-end: 0) {
          .foo {
            --x-inset-inline-end: 10px;
            left: var(--foo-rtl, var(--x-inset-inline-start));
            right: var(--foo-ltr, var(--x-inset-inline-start));
          }
        }
        .foo {
          inset-inline-end: 10px;
        }
      `,
      {},
      `
        * {
          --x-inset-inline-end: initial;
        }
        [dir="ltr"], html:not([dir="rtl"]) {
          --is-ltr: 1;
          --is-rtl: 0;
          --start: left;
          --end: right;
          --inline-unit: 1;
          --foo-ltr: 10px;
          --foo-rtl: initial;
        }
        [dir="rtl"] {
          --is-ltr: 0;
          --is-rtl: 1;
          --start: right;
          --end: left;
          --inline-unit: -1;
          --foo-ltr: initial;
          --foo-rtl: 10px;
        }
      `
    );
  });
});
