#!/usr/bin/env node
import { globby } from 'globby'
import * as child_process from 'node:child_process'
import { createRequire } from 'node:module'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const transformerDirectory = path.join(
  __dirname,
  '..',
  'transforms',
  `${process.argv[2]}/index.ts`,
)

const jscodeshiftExecutable = require.resolve('.bin/jscodeshift')

const extensions = 'ts,js,tsx,jsx'

const runCodemod = async () => {
  child_process.execFile(
    jscodeshiftExecutable,
    [
      '-t',
      transformerDirectory,
      '--extensions',
      extensions,
      ...(process.argv.slice(3).length === 1
        ? await globby(process.argv[3])
        : await globby(process.argv.slice(3))),
    ],
    {},
  )
}

void runCodemod()
