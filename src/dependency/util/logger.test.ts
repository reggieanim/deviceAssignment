import anyTest, { TestFn } from 'ava';
import createLogger from '../util/logger'
const test = anyTest as TestFn<{ config: any }>;

test('Check logger creation', async t => {
    t.truthy(createLogger)
    const logger = createLogger('TestingLogger')
    t.truthy(logger)
})
