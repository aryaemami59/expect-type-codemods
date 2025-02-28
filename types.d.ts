import 'jscodeshift/src/testUtils.js'

declare module 'jscodeshift/src/testUtils.js' {
  export function applyTransform(
    module:
      | {
          default: Transform
          parser: TestOptions['parser']
        }
      | Transform,
    options: Options | null | undefined,
    input: {
      path?: string
      source: string
    },
    testOptions?: TestOptions,
  ): Promise<string> | string
}
