'use strict';

const expect = require('expect.js');
const RamRoleArnCredential = require('../lib/ram_role_arn_credential');
const mm = require('mm');
const utils = require('../lib/util/utils');
const httpUtil = require('../lib/util/http');
const defaultConfig = {
  type: 'ram_role_arn',
  roleArn: 'roleArn',
  accessKeyId: 'accessKeyId',
  accessKeySecret: 'accessKeySecret'
};

describe('RamRoleArnCredential with correct config', function () {
  const cred = new RamRoleArnCredential(defaultConfig);
  before(function () {
    mm(httpUtil, 'request', function () {
      return {
        RequestId: '76C9056D-0E40-4ED9-A82E-D69B30E733C8',
        Credentials: {
          AccessKeySecret: 'AccessKeySecret',
          AccessKeyId: 'AccessKeyId',
          Expiration: utils.timestamp(new Date(), 1000 * 3600),
          SecurityToken: 'SecurityToken'
        }
      };
    });
  });
  after(function () {
    mm.restore();
  });
  it('should success', async function () {
    let id = await cred.getAccessKeyId();
    expect(id).to.be('AccessKeyId');
    let secret = await cred.getAccessKeySecret();
    expect(secret).to.be('AccessKeySecret');
    let token = await cred.getSecurityToken();
    expect(token).to.be('SecurityToken');
    let type = cred.getType();
    expect(type).to.be('ram_role_arn');
  });
  it('should refresh credentials with sessionCredential expired', async function () {
    cred.sessionCredential.Expiration = utils.timestamp(cred.sessionCredential.Expiration, -1000 * 3600 * 0.96);
    let needRefresh = cred.needUpdateCredential();
    expect(needRefresh).to.be(true);
    let token = await cred.getSecurityToken();
    expect(token).to.be('SecurityToken');
  });
  it('should refresh credentials with no sessionCredential', async function () {
    cred.sessionCredential = null;
    let needRefresh = cred.needUpdateCredential();
    expect(needRefresh).to.be(true);
    let secret = await cred.getAccessKeySecret();
    expect(secret).to.be('AccessKeySecret');
    let id = await cred.getAccessKeyId();
    expect(id).to.be('AccessKeyId');
  });
});
describe('RamRoleArnCredential with correct config', function () {
  defaultConfig.policy = 'policy';
  const cred = new RamRoleArnCredential(defaultConfig);
  before(function () {
    mm(httpUtil, 'request', function () {
      return {
        RequestId: '76C9056D-0E40-4ED9-A82E-D69B30E733C8',
        Credentials: {
          AccessKeySecret: 'AccessKeySecret',
          AccessKeyId: 'AccessKeyId',
          Expiration: utils.timestamp(new Date(), 1000 * 3600),
          SecurityToken: 'SecurityToken'
        }
      };
    });
  });
  after(function () {
    mm.restore();
  });
  it('should success', async function () {
    let id = await cred.getAccessKeyId();
    expect(id).to.be('AccessKeyId');
    let secret = await cred.getAccessKeySecret();
    expect(secret).to.be('AccessKeySecret');
    let token = await cred.getSecurityToken();
    expect(token).to.be('SecurityToken');
    let type = cred.getType();
    expect(type).to.be('ram_role_arn');
  });
});
describe('RamRoleArnCredential should filed with invalid config ', function () {
  it('should failed when config has no accessKeyId', async function () {
    expect(function () {
      new RamRoleArnCredential({
        type: 'ram_role_arn',
        roleArn: 'roleArn',
        accessKeySecret: 'accessKeySecret',
      });
    }).throwException(/Missing required accessKeyId option in config for ram_role_arn/);
  });
  it('should failed when config has no accessKeySecret', async function () {
    expect(function () {
      new RamRoleArnCredential({
        type: 'ram_role_arn',
        roleArn: 'roleArn',
        accessKeyId: 'accessKeyId'
      });
    }).throwException(/Missing required accessKeySecret option in config for ram_role_arn/);
  });
  it('should failed when config has no roleArn', async function () {
    expect(function () {
      new RamRoleArnCredential({
        type: 'ram_role_arn',
        accessKeyId: 'accessKeyId',
        accessKeySecret: 'accessKeySecret'
      });
    }).throwException(/Missing required roleArn option in config for ram_role_arn/);
  });
});


