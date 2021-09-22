import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';

import pkg from './package.json';

const libraryName = 'RiotSak';

const globals = {};

export default [
    {
        input: 'lib/index.ts',
        plugins: [

            del({ targets: 'dist/*' }),

            typescript({
                useTsconfigDeclarationDir: true,
                tsconfigOverride: {
                    compilerOptions: {
                        module: 'esnext'
                    }
                }
            }),

            terser(),
        ],
        output: [
            {
                name: libraryName,
                file: pkg.cdn,
                format: 'iife',
                sourcemap: true,
                inlineDynamicImports: true,
                globals
            },
            {
                file: pkg.module,
                format: 'es',
                sourcemap: true
            },
            {
                file: pkg.main,
                name: libraryName,
                format: 'umd',
                sourcemap: true
            }
        ],
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
            ...Object.keys(pkg.devDependencies || {}),
        ]
    }
];