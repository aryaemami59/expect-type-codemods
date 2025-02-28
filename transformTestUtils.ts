import type { Transform } from 'jscodeshift'
import type { TestOptions } from 'jscodeshift/src/testUtils.js'
import { applyTransform } from 'jscodeshift/src/testUtils.js'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

export const runTransformTest = (
  transformName: string,
  transform: Transform,
  parser: TestOptions['parser'],
  fixturePath: string,
) => {
  describe(transformName, async () => {
    const { globby } = await import('globby')

    const entries = await globby('**/*.input.*', {
      cwd: fixturePath,
      absolute: true,
      objectMode: true,
    })

    await Promise.all(
      entries.map(async ({ name: fileName, path: testInputPath }) => {
        const extension = path.extname(fileName)

        const testName = path.basename(fileName, `.input${extension}`)

        const inputFilePath = path.join(
          fixturePath,
          `${testName}.input${extension}`,
        )

        const outputFilePath = path.join(
          fixturePath,
          `${testName}.output${extension}`,
        )

        const inputFileContent = await fs.readFile(inputFilePath, {
          encoding: 'utf-8',
        })

        const expectedOutput = await fs.readFile(outputFilePath, {
          encoding: 'utf-8',
        })

        describe(`${testName}${extension}`, () => {
          it('transforms correctly', async () => {
            const actualOutput = await applyTransform(
              { default: transform, parser },
              {},
              {
                path: testInputPath,
                source: inputFileContent,
              },
              { parser },
            )

            expect(actualOutput).toBe(expectedOutput.trim())
          })

          it('is idempotent', async () => {
            const actualOutput = await applyTransform(
              { default: transform, parser },
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
}
