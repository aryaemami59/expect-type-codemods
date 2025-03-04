import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import {
  parser,
  toMatchObjectTypeTransform,
} from '../src/transforms/toMatchObjectType.js'
import { runTransformTest } from '../transformTestUtils.js'
import {
  fixtureParentDirectoryPath,
  runCodemodCLI,
  tempParentDirectoryPath,
} from './test-utils.js'

const testName = path.basename(import.meta.filename, '.test.ts')

const fixtureDirectoryPath = path.join(fixtureParentDirectoryPath, testName)

const tempDirectoryPath = path.join(tempParentDirectoryPath, testName)

describe(toMatchObjectTypeTransform, () => {
  runTransformTest(
    testName,
    toMatchObjectTypeTransform,
    parser,
    fixtureDirectoryPath,
  )
})

describe('cli test', () => {
  test('glob patterns work', async () => {
    await expect(
      runCodemodCLI([testName, './**/*-*.*.{m,c,}ts{x,}'], {
        cwd: tempDirectoryPath,
      }),
    ).resolves.not.toThrow()

    const expected = await fs.readFile(
      path.join(fixtureDirectoryPath, 'basic-ts.output.ts'),
      { encoding: 'utf-8' },
    )

    const outputFilePaths = (
      await fs.readdir(tempDirectoryPath, {
        encoding: 'utf-8',
        withFileTypes: true,
      })
    ).map((directoryEntry) =>
      path.join(directoryEntry.parentPath, directoryEntry.name),
    )

    const outputFileContents = await Promise.all(
      outputFilePaths.map((outputFilePath) =>
        fs.readFile(outputFilePath, { encoding: 'utf-8' }),
      ),
    )

    expect(outputFileContents).toStrictEqual(
      Array(outputFilePaths.length).fill(expected),
    )
  })
})
