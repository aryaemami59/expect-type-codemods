import type { Transform } from 'jscodeshift'
import type { TestOptions } from 'jscodeshift/src/testUtils.js'
import { format, resolveConfig } from 'prettier'

export const toMatchObjectTypeTransform: Transform = async (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: { name: 'toMatchTypeOf' },
      },
    })
    .forEach((path) => {
      const { callee } = path.node

      if (
        !j.MemberExpression.check(callee) ||
        !j.Identifier.check(callee.property)
      ) {
        return
      }

      callee.property.name = 'toMatchObjectType'
    })

  const prettierConfig = await resolveConfig(file.path)

  const source = await format(
    root.toSource({
      lineTerminator: '\n',
    }),
    { ...prettierConfig, filepath: file.path },
  )

  return source
}

export const parser = 'tsx' satisfies TestOptions['parser']

// export default toMatchObjectTypeTransform
