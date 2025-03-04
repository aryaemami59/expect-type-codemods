import { applyTransform } from 'jscodeshift/src/testUtils.js'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { parser, toExtendTransform } from '../src/transforms/toExtend.js'
import {
  fixtureParentDirectoryPath,
  runCodemodCLI,
  tempParentDirectoryPath,
} from './test-utils.js'

const transformerName = path.basename(import.meta.filename, '.test.ts')

const fixtureDirectoryPath = path.join(
  fixtureParentDirectoryPath,
  transformerName,
)

const tempDirectoryPath = path.join(tempParentDirectoryPath, transformerName)

describe(toExtendTransform, () => {
  describe(transformerName, async () => {
    const { globby } = await import('globby')

    const entries = await globby('**/*.input.*', {
      cwd: fixtureDirectoryPath,
      absolute: true,
      objectMode: true,
    })

    await Promise.all(
      entries.map(async ({ name: fileName, path: testInputPath }) => {
        const extension = path.extname(fileName)

        const testName = path.basename(fileName, `.input${extension}`)

        const inputFilePath = path.join(
          fixtureDirectoryPath,
          `${testName}.input${extension}`,
        )

        const outputFilePath = path.join(
          fixtureDirectoryPath,
          `${testName}.output${extension}`,
        )

        const inputFileContent = await fs.readFile(inputFilePath, {
          encoding: 'utf-8',
        })

        const expectedOutput = await fs.readFile(outputFilePath, {
          encoding: 'utf-8',
        })

        describe(`${testName}${extension}`, () => {
          it('transforms correctly', () => {
            const actualOutput = applyTransform(
              { default: toExtendTransform, parser },
              {},
              {
                path: testInputPath,
                source: inputFileContent,
              },
              { parser },
            )

            expect(actualOutput).toBe(expectedOutput.trim())
          })

          it('is idempotent', () => {
            const actualOutput = applyTransform(
              { default: toExtendTransform, parser },
              {},
              {
                path: testInputPath,
                source: inputFileContent,
              },
              { parser },
            )

            expect(actualOutput).toBe(expectedOutput.trim())
          })
        })
      }),
    )
  })
})

describe('cli test', () => {
  test('glob patterns work', async () => {
    await expect(
      runCodemodCLI([transformerName, './**/*-*.*.{m,c,}ts{x,}'], {
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
