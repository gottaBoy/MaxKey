import request from '@/utils/request';

interface QrCodeResponse {
  rqCode: string; // base64 图片
  ticket: string; // 二维码 ticket
}

interface QrCodeLoginParams {
  authType: string; // 'scancode'
  code: string; // ticket
  state: string; // state
}

class QrCodeService {
  /**
   * 获取登录二维码
   */
  async getLoginQrCode(): Promise<QrCodeResponse> {
    return request.get('/sign/login/genScanCode', {
      params: { _allow_anonymous: true },
    });
  }

  /**
   * 二维码登录轮询
   */
  async loginByQrCode(params: QrCodeLoginParams): Promise<any> {
    return request.post('/sign/login/sign/qrcode', params, {
      params: { _allow_anonymous: true },
    });
  }
}

export default new QrCodeService();

