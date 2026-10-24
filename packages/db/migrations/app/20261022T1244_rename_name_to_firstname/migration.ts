#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/ac111ba8633a4369b3028940d3ba4d7e13e4b84c1c14bd0727f3e250830e6fbc/contract';
import startContract from '../../snapshots/ac111ba8633a4369b3028940d3ba4d7e13e4b84c1c14bd0727f3e250830e6fbc/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ca1472bd4c7ec621669cbac1341acc776f8576355f2e18f3faff8722934ac2bb/contract';
import endContract from '../../snapshots/ca1472bd4c7ec621669cbac1341acc776f8576355f2e18f3faff8722934ac2bb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      ...this.renameColumn({ schema: 'public', table: 'User', column: 'name', to: 'firstname' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
