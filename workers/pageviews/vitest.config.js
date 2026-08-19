import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

const migrations = await readD1Migrations('./migrations');

export default defineWorkersConfig({
  test: {
    setupFiles: ['./test/apply-migrations.js'],
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          bindings: { TEST_MIGRATIONS: migrations }
        }
      }
    }
  }
});
