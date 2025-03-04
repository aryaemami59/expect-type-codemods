import * as fs from 'node:fs/promises'
import path from 'node:path'
import type { TestProject } from 'vitest/node'
import {
  extensionsToTest,
  fixtureParentDirectoryPath,
  tempParentDirectoryPath,
} from './tests/test-utils.js'

export async function setup(_testProject: TestProject): Promise<void> {
  await fs.rm(tempParentDirectoryPath, { force: true, recursive: true })

  await fs.mkdir(tempParentDirectoryPath, { recursive: true })

  await fs.cp(fixtureParentDirectoryPath, tempParentDirectoryPath, {
    recursive: true,
    filter: (source) => !source.endsWith('.output.ts'),
  })

  const directoryEntries = await Promise.all(
    (
      await fs.readdir(tempParentDirectoryPath, {
        recursive: true,
        encoding: 'utf-8',
        withFileTypes: true,
      })
    )
      .filter((directoryEntry) => directoryEntry.isFile())
      .map(async (directoryEntry) => {
        await fs.rename(
          path.join(directoryEntry.parentPath, directoryEntry.name),
          path.join(directoryEntry.parentPath, 'basic-ts.output.ts'),
        )

        return path.join(directoryEntry.parentPath, 'basic-ts.output.ts')
      }),
  )

  await Promise.all(
    directoryEntries.map(async (directoryEntry) => {
      await Promise.all(
        extensionsToTest.map((extensionToTest) =>
          fs.copyFile(
            directoryEntry,
            path.join(
              path.dirname(directoryEntry),
              `${path.basename(directoryEntry, '.ts')}.${extensionToTest}`,
            ),
          ),
        ),
      )
    }),
  )
}

export async function teardown(): Promise<void> {
  if (process.env.KEEP_TEMP_DIR !== 'true') {
    await fs.rm(tempParentDirectoryPath, { force: true, recursive: true })
  }
}
