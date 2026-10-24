#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/7e6d3ea64a7288d591d739a46915d519844505c8f703abf1d3dcee0e9698515e/contract';
import startContract from '../../snapshots/7e6d3ea64a7288d591d739a46915d519844505c8f703abf1d3dcee0e9698515e/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ac111ba8633a4369b3028940d3ba4d7e13e4b84c1c14bd0727f3e250830e6fbc/contract';
import endContract from '../../snapshots/ac111ba8633a4369b3028940d3ba4d7e13e4b84c1c14bd0727f3e250830e6fbc/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'User',
        column: 'password',
        type: 'text',
        temporaryDefault: sql`''`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
