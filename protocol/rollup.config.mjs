import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";

export function bundle(...inputMaybeArray) {
  const inputArr = Array.isArray(inputMaybeArray)
    ? inputMaybeArray
    : [inputMaybeArray];
  return inputArr.flatMap((input) => {
    const [, name] = input.match(/([^\/]+)\.ts$/) || [];

    return [
      {
        input,
        external: (id) => !/^[./]/.test(id),
        plugins: [esbuild(),json()],
        output: [
          {
            file: `./dist/${name}.js`,
            format: "cjs",
            sourcemap: true,
          },
          {
            file: `./dist/${name}.cjs`,
            format: "cjs",
            sourcemap: true,
          },
          {
            file: `./dist/${name}.mjs`,
            format: "es",
            sourcemap: true,
          },
        ],
      },
      {
        input,
        external: (id) => !/^[./]/.test(id),
        plugins: [dts(),json()],
        output: {
          file: `./dist/${name}.d.ts`,
          format: "es",
        },
      },
    ];
  });
}

// Export rollup config
export default [...bundle("./src/index.ts")];
