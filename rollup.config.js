import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/ethcal-ui.esm.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: 'dist/ethcal-ui.cjs.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/ethcal-ui.umd.js',
        format: 'umd',
        name: 'EthiopianCalendarUI',
        sourcemap: true,
        globals: {}
      }
    ],
    plugins: [
      postcss({
        extract: true,
        extract: 'ethcal-ui.css',
        minimize: production
      }),
      production && terser()
    ]
  }
];
