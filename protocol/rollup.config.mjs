import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

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
        plugins: [esbuild()],
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
        plugins: [dts()],
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
