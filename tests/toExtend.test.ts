import * as child_process from 'node:child_process'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { parser, toExtendTransform } from '../src/transforms/toExtend.js'
import { runTransformTest } from '../transformTestUtils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const execFile = promisify(child_process.execFile)

const fixturePath = path.join(__dirname, '__testfixtures__', 'toExtend')

const tempDir = path.join(__dirname, '..', '.temp', 'toExtend')

const src = path.join(fixturePath, 'basic-ts.input.ts')

const extensionsToTest = ['ts', 'tsx', 'mts', 'cts']

const destFiles = extensionsToTest.map((extensionToTest) =>
  path.join(tempDir, `basic-ts.output.${extensionToTest}`),
)

describe(toExtendTransform, () => {
  runTransformTest('toExtend', toExtendTransform, parser, fixturePath)
})

describe('cli test', () => {
  beforeAll(async () => {
    await fs.mkdir(tempDir, { recursive: true })

    await Promise.all(destFiles.map((dest) => fs.copyFile(src, dest)))
  })

  test('glob patterns work', async () => {
    await expect(
      execFile(
        'expect-type-codemods',
        ['toExtend', './**/*-*.*.{m,c,}ts{x,}'],
        {
          cwd: tempDir,
          encoding: 'utf-8',
          shell: true,
        },
      ),
    ).resolves.not.toThrow()

    const expected = await fs.readFile(
      path.join(fixturePath, 'basic-ts.output.ts'),
      { encoding: 'utf-8' },
    )

    const contents = await Promise.all(
      destFiles.map((dest) => fs.readFile(dest, { encoding: 'utf-8' })),
    )

    expect(contents).toStrictEqual(Array(destFiles.length).fill(expected))
  })
})
