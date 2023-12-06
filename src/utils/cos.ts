import envConfig from '../../env'
import COS, { PutObjectResult, UploadBody } from 'cos-nodejs-sdk-v5'

export const saveToCos = (path: string, buffer: UploadBody) => {
  const cos = new COS({
    SecretId: envConfig.tencent.secretId,
    SecretKey: envConfig.tencent.secretKey,
  })

  return new Promise<PutObjectResult>((resolve, reject) => {
    cos.putObject(
      {
        Bucket: envConfig.tencent.cosv5.bucket,
        Region: envConfig.tencent.cosv5.region,
        Key: `${envConfig.tencent.cosv5.prefix}${path}`,
        Body: buffer,
      },
      (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      },
    )
  })
}
