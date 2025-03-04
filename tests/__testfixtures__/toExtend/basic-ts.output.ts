import { expectTypeOf } from 'expect-type'

const selector = (state: []) => state

expectTypeOf(selector).parameter(0).not.toExtend<{ foo: '' }>()

expectTypeOf(selector).parameter(0).toExtend<{ foo: '' }>()

expectTypeOf(selector).parameter(0).not.toExtend({ foo: '' })

expectTypeOf(selector).parameter(0).toExtend({ foo: '' })
