/* Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. */

jest.mock('cli-ux', () => ({
  default: {
    confirm: jest.fn().mockResolvedValue(true)
  }
}));
jest.retryTimes(3);

import * as path from 'path';
import * as fs from 'fs-extra';
import GenerateODataClient from '../src/commands/generate-odata-client';
import { rm } from '../src/utils';
import { getTestOutputDir, TimeThresholds } from './test-utils';

describe('generate-odata-client', () => {
  const pathForTests = getTestOutputDir(__filename);

  beforeAll(async () => {
    await rm(pathForTests);
    const pathForResources = path.resolve(
      __dirname,
      'resources',
      'template-generator-odata-client'
    );
    await fs.copy(pathForResources, pathForTests);
  }, TimeThresholds.LONG);

  it(
    '[E2E] should generate a OData client',
    async () => {
      await GenerateODataClient.run([
        '-i',
        'edmxSource',
        '-o',
        'output',
        '--projectDir',
        pathForTests
      ]);

      const files = await fs.readdir(path.resolve(pathForTests, 'output'));
      expect(files).toHaveLength(1);
    },
    TimeThresholds.LONG
  );
});
