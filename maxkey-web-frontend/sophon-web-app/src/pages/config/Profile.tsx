import { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Radio, Select, InputNumber, Upload, Button, message, Modal, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import type { User } from '@/types/entity';
import usersService from '@/services/users.service';
import './Profile.less';

const { TabPane } = Tabs;
const { Option } = Select;

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const user = await usersService.getProfile();
      form.setFieldsValue({
        ...user,
        gender_select: user.gender?.toString() || '2',
        str_idType: user.idType?.toString() || '0',
        str_married: user.married?.toString() || '0',
        str_status: user.status?.toString() || '1',
      });

      // 设置头像
      if (user.pictureBase64) {
        setFileList([
          {
            uid: user.id || '-1',
            name: user.displayName || 'avatar',
            status: 'done',
            url: user.pictureBase64,
          },
        ]);
        setPreviewImage(user.pictureBase64);
      }
    } catch (error: any) {
      console.error('加载用户资料失败:', error);
      message.error('加载用户资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    if (file.status === 'done' && file.response?.data) {
      form.setFieldValue('pictureId', file.response.data);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // 转换字段
      const submitData: any = {
        ...values,
        gender: values.gender_select ? parseInt(values.gender_select) : undefined,
        idType: values.str_idType ? parseInt(values.str_idType) : undefined,
        married: values.str_married ? parseInt(values.str_married) : undefined,
        status: values.str_status ? parseInt(values.str_status) : undefined,
      };

      await usersService.updateProfile(submitData);
      message.success('保存成功');
    } catch (error: any) {
      console.error('保存用户资料失败:', error);
      message.error('保存用户资料失败');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <Card loading={loading}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基本信息" key="basic">
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="pictureId" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="姓名" name="displayName" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="登录账号" name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label="性别" name="gender_select">
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="2">男</Radio.Button>
                <Radio.Button value="1">女</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="头像" name="picture">
              <Upload
                action="/sign/file/upload/"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                maxCount={1}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <Image alt="preview" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Form.Item>
            <Form.Item label="工号" name="employeeNumber">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Windows账号" name="windowsAccount">
              <Input disabled />
            </Form.Item>
            <Form.Item label="手机" name="mobile">
              <Input disabled />
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item label="用户类型" name="userType">
              <Select disabled>
                <Option value="EMPLOYEE">员工</Option>
                <Option value="SUPPLIER">供应商</Option>
                <Option value="CUSTOMER">客户</Option>
                <Option value="CONTRACTOR">承包商</Option>
                <Option value="DEALER">经销商</Option>
                <Option value="PARTNER">合作伙伴</Option>
                <Option value="EXTERNAL">外部</Option>
                <Option value="INTERN">实习生</Option>
                <Option value="TEMP">临时</Option>
              </Select>
            </Form.Item>
            <Form.Item label="用户状态" name="userState">
              <Select disabled>
                <Option value="RESIDENT">常住</Option>
                <Option value="WITHDRAWN">已撤回</Option>
                <Option value="INACTIVE">非活跃</Option>
                <Option value="RETIREE">退休</Option>
              </Select>
            </Form.Item>
            <Form.Item label="排序号" name="sortIndex">
              <InputNumber disabled min={1} max={100000} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="状态" name="str_status">
              <Select disabled>
                <Option value="1">激活</Option>
                <Option value="2">非激活</Option>
                <Option value="4">禁用</Option>
                <Option value="5">锁定</Option>
                <Option value="9">删除</Option>
              </Select>
            </Form.Item>
          </TabPane>

          <TabPane tab="个人信息" key="personal">
            <Form.Item label="姓" name="familyName">
              <Input />
            </Form.Item>
            <Form.Item label="中间名" name="middleName">
              <Input />
            </Form.Item>
            <Form.Item label="名" name="givenName">
              <Input />
            </Form.Item>
            <Form.Item label="昵称" name="nickName">
              <Input />
            </Form.Item>
            <Form.Item label="证件类型" name="str_idType">
              <Select>
                <Option value="0">未知</Option>
                <Option value="1">身份证</Option>
                <Option value="2">护照</Option>
                <Option value="3">学生证</Option>
                <Option value="4">军官证</Option>
              </Select>
            </Form.Item>
            <Form.Item label="证件号码" name="idCardNo">
              <Input />
            </Form.Item>
            <Form.Item label="婚姻状况" name="str_married">
              <Select>
                <Option value="0">未知</Option>
                <Option value="1">未婚</Option>
                <Option value="2">已婚</Option>
                <Option value="3">离异</Option>
                <Option value="4">丧偶</Option>
              </Select>
            </Form.Item>
            <Form.Item label="出生日期" name="birthDate">
              <Input />
            </Form.Item>
            <Form.Item label="学历" name="education">
              <Input />
            </Form.Item>
            <Form.Item label="毕业院校" name="graduateFrom">
              <Input />
            </Form.Item>
            <Form.Item label="毕业日期" name="graduateDate">
              <Input />
            </Form.Item>
            <Form.Item label="工作开始日期" name="startWorkDate">
              <Input />
            </Form.Item>
            <Form.Item label="时区" name="timeZone">
              <Input />
            </Form.Item>
            <Form.Item label="首选语言" name="preferredLanguage">
              <Input />
            </Form.Item>
            <Form.Item label="网站" name="webSite">
              <Input />
            </Form.Item>
            <Form.Item label="即时通讯" name="defineIm">
              <Input />
            </Form.Item>
          </TabPane>

          <TabPane tab="机构信息" key="business">
            <Form.Item label="组织" name="organization">
              <Input disabled />
            </Form.Item>
            <Form.Item label="部门" name="division">
              <Input disabled />
            </Form.Item>
            <Form.Item label="部门ID" name="departmentId">
              <Input disabled />
            </Form.Item>
            <Form.Item label="部门名称" name="department">
              <Input disabled />
            </Form.Item>
            <Form.Item label="成本中心" name="costCenter">
              <Input disabled />
            </Form.Item>
            <Form.Item label="职级" name="jobLevel">
              <Input disabled />
            </Form.Item>
            <Form.Item label="职位" name="jobTitle">
              <Input disabled />
            </Form.Item>
            <Form.Item label="上级" name="manager">
              <Input disabled />
            </Form.Item>
            <Form.Item label="助理" name="assistant">
              <Input disabled />
            </Form.Item>
            <Form.Item label="办公地点" name="workOfficeName">
              <Input disabled />
            </Form.Item>
            <Form.Item label="入职日期" name="entryDate">
              <Input disabled />
            </Form.Item>
            <Form.Item label="离职日期" name="quitDate">
              <Input disabled />
            </Form.Item>
          </TabPane>

          <TabPane tab="机构扩展" key="businessExtra">
            <Form.Item label="工作电话" name="workPhoneNumber">
              <Input />
            </Form.Item>
            <Form.Item label="工作邮箱" name="workEmail">
              <Input />
            </Form.Item>
            <Form.Item label="工作国家" name="workCountry">
              <Input />
            </Form.Item>
            <Form.Item label="工作区域" name="workRegion">
              <Input />
            </Form.Item>
            <Form.Item label="工作城市" name="workLocality">
              <Input />
            </Form.Item>
            <Form.Item label="工作街道" name="workStreetAddress">
              <Input />
            </Form.Item>
            <Form.Item label="工作邮编" name="workPostalCode">
              <Input />
            </Form.Item>
            <Form.Item label="工作传真" name="workFax">
              <Input />
            </Form.Item>
          </TabPane>

          <TabPane tab="家庭信息" key="home">
            <Form.Item label="家庭邮箱" name="homeEmail">
              <Input />
            </Form.Item>
            <Form.Item label="家庭电话" name="homePhoneNumber">
              <Input />
            </Form.Item>
            <Form.Item label="家庭传真" name="homeFax">
              <Input />
            </Form.Item>
            <Form.Item label="家庭邮编" name="homePostalCode">
              <Input />
            </Form.Item>
            <Form.Item label="家庭国家" name="homeCountry">
              <Input />
            </Form.Item>
            <Form.Item label="家庭区域" name="homeRegion">
              <Input />
            </Form.Item>
            <Form.Item label="家庭城市" name="homeLocality">
              <Input />
            </Form.Item>
            <Form.Item label="家庭街道" name="homeStreetAddress">
              <Input />
            </Form.Item>
          </TabPane>
        </Tabs>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={submitting} size="large">
            提交
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default Profile;

