import { expectTypeOf } from 'expect-type'

const selector = (state: []) => state

expectTypeOf(selector).parameter(0).not.toMatchTypeOf<{ foo: '' }>()

expectTypeOf(selector).parameter(0).toMatchTypeOf<{ foo: '' }>()

expectTypeOf(selector).parameter(0).not.toMatchTypeOf({ foo: '' })

expectTypeOf(selector).parameter(0).toMatchTypeOf({ foo: '' })
