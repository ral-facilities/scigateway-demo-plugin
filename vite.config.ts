import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { PluginOption, UserConfig, defineConfig, loadEnv } from 'vite';

// Obtain default coverage config from vitest when not building for production
// (to avoid importing vitest during build as its a dev dependency)
let vitestDefaultExclude: string[] = [];
let vitestCoverageConfigDefaultsExclude: string[] = [];
if (process.env.NODE_ENV !== 'production') {
  await import('vitest/config').then((vitestConfig) => {
    vitestDefaultExclude = vitestConfig.defaultExclude;
    vitestCoverageConfigDefaultsExclude =
      vitestConfig.coverageConfigDefaults.exclude;
  });
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Whether to output build files in a way SciGateway can load (the default for production unless e2e testing)
  const buildLibrary =
    env.NODE_ENV === 'production' && env.VITE_APP_BUILD_STANDALONE !== 'true';

  const plugins: PluginOption[] = [react()];

  const config: UserConfig = {
    plugins: plugins,
    server: {
      port: 3000,
    },
    preview: {
      port: 5001,
    },
    define: {
      // See https://vitejs.dev/guide/build.html#library-mode
      // we need to replace here as the build in library mode won't
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
    },
  };

  const rollupExternals: string[] = [];

  if (buildLibrary) {
    // Config for deployment in SciGateway
    config.build = {
      lib: {
        // We use `umd` here as `es` causes some import statements to leak into the main.js, breaking the build
        // removing this entirely uses a default of both, which for build results in `umd` taking precedence but when
        // using --watch, `es` appears to replace it intermittently. Hopefully this can be fixed in the future and we
        // can use `es` instead.
        formats: ['umd'],
        entry: 'src/main.tsx',
        name: 'demo_plugin',
      },
      rollupOptions: {
        external: ['react', 'react-dom'].concat(rollupExternals),
        input: 'src/main.tsx',
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].chunk.js',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
        preserveEntrySignatures: 'strict',
      },
    };
  } else {
    // Config for stand alone deployment e.g. for cypress
    config.build = {
      rollupOptions: {
        input: ['src/main.tsx', './index.html'],
        // Don't make react/react-dom external as not a library here, so have to bundle
        external: rollupExternals,
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
        preserveEntrySignatures: 'strict',
      },
    };
  }

  // Use browserslist config
  config.build.target = browserslistToEsbuild();

  return {
    ...config,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/setupTests.ts'],
      exclude: [...vitestDefaultExclude, 'e2e/**'],
      coverage: {
        reporter: [
          // Default
          'text',
          'html',
          'clover',
          'json',
          // Extra for VSCode extension
          ['lcov', { outputFile: 'lcov.info', silent: true }],
        ],
        exclude: [
          ...vitestCoverageConfigDefaultsExclude,
          'public/*',
          'server/*',
          'src/vite-env.d.ts',
        ],
      },
    },
  };
});
