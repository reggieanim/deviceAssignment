import anyTest, {TestFn} from 'ava';
import createContainer from './index'
const test = anyTest as TestFn<{ config: any }>;

test('Check create real container', async t => {
  t.truthy(createContainer())
})
