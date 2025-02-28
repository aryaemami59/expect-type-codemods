import * as path from 'node:path'
import {
  parser,
  toMatchObjectTypeTransform,
} from '../src/transforms/toMatchObjectType.js'
import { runTransformTest } from '../transformTestUtils.js'

runTransformTest(
  'toMatchObjectType',
  toMatchObjectTypeTransform,
  parser,
  path.join(import.meta.dirname, '__testfixtures__'),
)
