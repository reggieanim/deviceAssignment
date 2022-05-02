import anyTest, {TestFn} from 'ava';
import {
  createGetFromS3,
  createPresignedUrl,
  UrlMethod
} from './s3'
import {config} from '../config'
const test = anyTest as TestFn<{ config: any, fakeS3Client:any }>;

test.beforeEach(async t => {
  const fakeS3ResponseAfterUpload = ({ etag: 'EEEEE' })
  const fakeS3GetResponse = ({ Body: 'Body of object' })
  const fakes3ListResponse = ({ Contents: [] })
  const fakeS3ResponseAfterDelete = ({ etag: 'EEEEE' })
  const fakeSignedUrl = 's2.aws.come/874874xamz-6'
  const createFakeS3Client = () => ({
    putObject: () => ({ promise: () => Promise.resolve(fakeS3ResponseAfterUpload) }),
    getObject: () => ({ promise: () => Promise.resolve(fakeS3GetResponse) }),
    listObjectsV2: () => ({ promise: () => Promise.resolve(fakes3ListResponse) }),
    deleteObject: () => ({ promise: () => Promise.resolve(fakeS3ResponseAfterDelete) }),
    getSignedUrl: () =>  Promise.resolve(fakeSignedUrl)
  })
  t.context.fakeS3Client = createFakeS3Client()
  t.context.config = config
})

test('Check get from s3', async t => {
  const { fakeS3Client: s3Client, config } = t.context
  t.truthy(createGetFromS3)
  const getFromS3 = createGetFromS3({ s3Client, config })
  const resp = await getFromS3('sample-s3-key.json')
  t.truthy(resp)
})

test('Check get presignedURL', async t => {
    const { fakeS3Client: s3Client, config } = t.context
    t.truthy(createPresignedUrl)
    const getPresignedURL = createPresignedUrl({ s3Client, config })
    const resp = await getPresignedURL(UrlMethod.put, {Key: 'images.jpg'})
    t.is(resp, 's2.aws.come/874874xamz-6')
  })
  

