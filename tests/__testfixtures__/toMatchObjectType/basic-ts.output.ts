import { expectTypeOf } from 'expect-type'

const selector = (state: []) => state

expectTypeOf(selector).parameter(0).not.toMatchObjectType<{ foo: '' }>()

expectTypeOf(selector).parameter(0).toMatchObjectType<{ foo: '' }>()

expectTypeOf(selector).parameter(0).not.toMatchObjectType({ foo: '' })

expectTypeOf(selector).parameter(0).toMatchObjectType({ foo: '' })
