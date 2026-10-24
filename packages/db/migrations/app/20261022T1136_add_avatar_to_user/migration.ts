#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/731ca5a8ba0f579edd21ade962439fd3761ee56e8e8e826adcdaab228441effb/contract';
import startContract from '../../snapshots/731ca5a8ba0f579edd21ade962439fd3761ee56e8e8e826adcdaab228441effb/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/7e6d3ea64a7288d591d739a46915d519844505c8f703abf1d3dcee0e9698515e/contract';
import endContract from '../../snapshots/7e6d3ea64a7288d591d739a46915d519844505c8f703abf1d3dcee0e9698515e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('avatar', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
