// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import { terser } from "rollup-plugin-terser";
import url from "rollup-plugin-url"

export default {
  input: 'example/index.js',
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    resolve(),
    babel(),
    json(),
    url(),
    terser({
      module: true,
      compress: {
        arrows: false // for safari 9.3
      }
    }),
  ]
};
