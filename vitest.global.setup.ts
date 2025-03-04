import * as fs from 'node:fs/promises'
import path from 'node:path'
import type { TestProject } from 'vitest/node'

const tempDirectoryPath = path.join(import.meta.dirname, '.temp')

export async function setup(_testProject: TestProject): Promise<void> {
  await fs.rm(tempDirectoryPath, { force: true, recursive: true })
  await fs.mkdir(tempDirectoryPath, { recursive: true })
}

export async function teardown(): Promise<void> {
  if (process.env.KEEP_TEMP_DIR !== 'true') {
    await fs.rm(tempDirectoryPath, { force: true, recursive: true })
  }
}
