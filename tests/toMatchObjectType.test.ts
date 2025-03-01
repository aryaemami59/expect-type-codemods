import * as child_process from 'node:child_process'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import {
  parser,
  toMatchObjectTypeTransform,
} from '../src/transforms/toMatchObjectType.js'
import { runTransformTest } from '../transformTestUtils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const execFile = promisify(child_process.execFile)

runTransformTest(
  'toMatchObjectType',
  toMatchObjectTypeTransform,
  parser,
  path.join(__dirname, '__testfixtures__'),
)

const tempDir = path.join(__dirname, '..', '.temp')

const src = path.join(__dirname, '__testfixtures__', 'basic-ts.input.ts')

const extensionsToTest = ['ts', 'tsx', 'mts', 'cts']

const destFiles = extensionsToTest.map((extensionToTest) =>
  path.join(tempDir, `basic-ts.input.${extensionToTest}`),
)

describe('cli test', () => {
  beforeAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true })

    await fs.mkdir(tempDir, { recursive: true })

    await Promise.all(destFiles.map((dest) => fs.copyFile(src, dest)))
  })

  test('glob patterns work', async () => {
    await expect(
      execFile('expect-type-codemods', ['./**/*-*.*.{m,c,}ts{x,}'], {
        cwd: tempDir,
        encoding: 'utf-8',
        shell: true,
      }),
    ).resolves.not.toThrow()

    const expected = await fs.readFile(
      path.join(__dirname, '__testfixtures__', 'basic-ts.output.ts'),
      { encoding: 'utf-8' },
    )

    const contents = await Promise.all(
      destFiles.map((dest) => fs.readFile(dest, { encoding: 'utf-8' })),
    )

    expect(contents).toStrictEqual(Array(destFiles.length).fill(expected))
  })
})
