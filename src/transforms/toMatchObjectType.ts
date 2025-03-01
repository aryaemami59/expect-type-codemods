import type { Transform } from 'jscodeshift'
import type { TestOptions } from 'jscodeshift/src/testUtils.js'

export const toMatchObjectTypeTransform: Transform = (file, api) => {
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

  const source = root.toSource({
    lineTerminator: '\n',
  })

  return source
}

export const parser = 'tsx' satisfies TestOptions['parser']
