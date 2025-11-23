import { useState, useEffect, useRef } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  ModalForm,
  ProFormText,
  ProFormTreeSelect,
  ProFormSelect,
  ProFormRadio,
  ProFormSwitch,
  ProFormDigit,
  ProFormDatePicker,
} from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import {
  Button,
  Space,
  Popconfirm,
  message,
  Tree,
  Row,
  Col,
  Tag,
  Tabs,
  Spin,
  Dropdown,
  MenuProps,
  Modal,
  Upload,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import type { DataNode } from 'antd/es/tree';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  MoreOutlined,
  LockOutlined,
  UnlockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { UserInfo } from '@/types/entity';
import userService from '@/services/user';
import organizationsService from '@/services/organizations.service';
import './UserList.less';

const UserList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const passwordFormRef = useRef<any>();
  const createFormRef = useRef<any>();
  const editFormRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [treeSelectData, setTreeSelectData] = useState<any[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [mfaModalVisible, setMfaModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<UserInfo>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState<any>({});
  const [createFileList, setCreateFileList] = useState<UploadFile[]>([]);
  const [editFileList, setEditFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState(false);

  // 加载组织树
  const loadOrgTree = async () => {
    setLoading(true);
    try {
      const result: any = await organizationsService.tree();
      console.log('组织树API响应:', result);
      
      let treeDataArray: any[] = [];
      
      if (Array.isArray(result)) {
        treeDataArray = result;
      } else if (result && typeof result === 'object' && result.rootNode && result.nodes) {
        const rootNode = result.rootNode;
        const nodes = result.nodes || [];
        console.log('根节点:', rootNode);
        console.log('所有节点:', nodes);
        
        const buildTree = (parentNode: any): any[] => {
          const children: any[] = [];
          
          for (const node of nodes) {
            const parentKey = node.parentKey || node.parentId || node.parent_id;
            const nodeKey = node.key || node.id;
            
            if (nodeKey && nodeKey !== parentNode.key && parentKey === parentNode.key) {
              const childNode: any = {
                id: nodeKey,
                name: node.title || node.name,
                key: nodeKey,
                title: node.title || node.name,
                isLeaf: true,
              };
              
              const grandChildren = buildTree(childNode);
              if (grandChildren.length > 0) {
                childNode.children = grandChildren;
                childNode.isLeaf = false;
                parentNode.isLeaf = false;
              }
              
              children.push(childNode);
            }
          }
          
          return children;
        };
        
        const rootNodeData: any = {
          id: rootNode.key,
          name: rootNode.title,
          key: rootNode.key,
          title: rootNode.title,
          isLeaf: false,
        };
        
        const children = buildTree(rootNodeData);
        if (children.length > 0) {
          rootNodeData.children = children;
        }
        
        treeDataArray = [rootNodeData];
        console.log('构建后的树形数据:', treeDataArray);
      } else if (result && typeof result === 'object' && result.data) {
        if (Array.isArray(result.data)) {
          treeDataArray = result.data;
        } else if (result.data.rootNode && result.data.nodes) {
          const rootNode = result.data.rootNode;
          const nodes = result.data.nodes || [];
          
          const buildTree = (parentNode: any): any[] => {
            const children: any[] = [];
            
            for (const node of nodes) {
              const parentKey = node.parentKey || node.parentId || node.parent_id;
              const nodeKey = node.key || node.id;
              
              if (nodeKey && nodeKey !== parentNode.key && parentKey === parentNode.key) {
                const childNode: any = {
                  id: nodeKey,
                  name: node.title || node.name,
                  key: nodeKey,
                  title: node.title || node.name,
                  isLeaf: true,
                };
                
                const grandChildren = buildTree(childNode);
                if (grandChildren.length > 0) {
                  childNode.children = grandChildren;
                  childNode.isLeaf = false;
                  parentNode.isLeaf = false;
                }
                
                children.push(childNode);
              }
            }
            
            return children;
          };
          
          const rootNodeData: any = {
            id: rootNode.key,
            name: rootNode.title,
            key: rootNode.key,
            title: rootNode.title,
            isLeaf: false,
          };
          
          const children = buildTree(rootNodeData);
          if (children.length > 0) {
            rootNodeData.children = children;
          }
          
          treeDataArray = [rootNodeData];
        }
      } else if (result && typeof result === 'object' && Array.isArray(result.records)) {
        treeDataArray = result.records;
      } else {
        console.error('组织树数据格式不正确:', result);
        message.error('组织树数据格式不正确，请检查API响应');
        return;
      }
      
      const nodes = convertToTreeData(treeDataArray);
      setTreeData(nodes);
      setTreeSelectData(convertToTreeSelectData(treeDataArray));
      
      const collectAllKeys = (nodeList: DataNode[]): React.Key[] => {
        const keys: React.Key[] = [];
        nodeList.forEach((node: DataNode) => {
          if (node.key) {
            if (node.children && Array.isArray(node.children) && node.children.length > 0) {
              keys.push(node.key);
              keys.push(...collectAllKeys(node.children));
            }
          }
        });
        return keys;
      };
      
      if (nodes.length > 0) {
        const allKeys = collectAllKeys(nodes);
        setExpandedKeys(allKeys);
      }
    } catch (error: any) {
      console.error('加载组织树失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '加载组织树失败';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgTree();
  }, []);

  // 转换为 Tree 组件数据格式
  const convertToTreeData = (nodes: any[], processedKeys: Set<string> = new Set(), depth: number = 0): DataNode[] => {
    if (!nodes || !Array.isArray(nodes)) {
      return [];
    }
    
    if (depth > 100) {
      console.warn('树形结构深度超过限制');
      return [];
    }
    
    return nodes.map((node) => {
      const key = node.id || node.key || node.orgId || '';
      const title = node.name || node.title || node.orgName || '';
      
      if (key && processedKeys.has(key)) {
        console.warn(`检测到循环引用: ${key}`);
        return {
          key,
          title: `${title} (循环引用)`,
          isLeaf: true,
        };
      }
      
      if (key) {
        processedKeys.add(key);
      }
      
      const children = node.children && Array.isArray(node.children) && node.children.length > 0
        ? convertToTreeData(node.children, processedKeys, depth + 1) 
        : undefined;
      
      if (key) {
        processedKeys.delete(key);
      }
      
      const result: DataNode = {
        key,
        title,
        isLeaf: !children || children.length === 0,
      };
      
      if (children && children.length > 0) {
        result.children = children;
      }
      
      return result;
    });
  };

  // 转换为 TreeSelect 组件数据格式
  const convertToTreeSelectData = (nodes: any[], processedKeys: Set<string> = new Set(), depth: number = 0): any[] => {
    if (!nodes || !Array.isArray(nodes)) {
      return [];
    }
    
    if (depth > 100) {
      return [];
    }
    
    return nodes.map((node) => {
      const value = node.id || node.key || node.orgId || '';
      const title = node.name || node.title || node.orgName || '';
      
      if (value && processedKeys.has(value)) {
        return {
          value,
          title: `${title} (循环引用)`,
        };
      }
      
      if (value) {
        processedKeys.add(value);
      }
      
      const children = node.children && Array.isArray(node.children) && node.children.length > 0
        ? convertToTreeSelectData(node.children, processedKeys, depth + 1)
        : undefined;
      
      if (value) {
        processedKeys.delete(value);
      }
      
      const result: any = {
        value,
        title,
      };
      
      if (children && children.length > 0) {
        result.children = children;
      }
      
      return result;
    });
  };

  // 选择组织节点 - 更新部门ID并刷新表格
  const handleSelectNode = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const orgId = String(selectedKeys[0]); // 确保转换为字符串
      console.log('选择组织节点，ID:', orgId);
      setSelectedDepartmentId(orgId);
      setSelectedOrgId(orgId);
      // 重置搜索参数，只保留部门ID
      setSearchParams({});
      // 立即刷新表格数据
      setTimeout(() => {
        actionRef.current?.reload();
      }, 0);
    } else {
      console.log('取消选择组织节点');
      setSelectedDepartmentId('');
      setSelectedOrgId(undefined);
      setSearchParams({});
      actionRef.current?.reload();
    }
  };

  // 获取Base64
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 预览头像
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  // 处理头像上传变化（新增）
  const handleCreateUploadChange: UploadProps['onChange'] = (info) => {
    const { fileList } = info;
    setCreateFileList(fileList);

    if (info.file.status === 'done') {
      const response = info.file.response;
      // MaxKey 返回格式: { code: 0, data: "fileId" }
      const fileId = response?.data || response;
      if (createFormRef.current) {
        createFormRef.current.setFieldsValue({ pictureId: fileId });
      }
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  // 处理头像上传变化（编辑）
  const handleEditUploadChange: UploadProps['onChange'] = (info) => {
    const { fileList } = info;
    setEditFileList(fileList);

    if (info.file.status === 'done') {
      const response = info.file.response;
      // MaxKey 返回格式: { code: 0, data: "fileId" }
      const fileId = response?.data || response;
      if (editFormRef.current) {
        editFormRef.current.setFieldsValue({ pictureId: fileId });
      }
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  // 自定义上传函数
  const customRequest = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append('uploadFile', file);

    try {
      const token = localStorage.getItem('token');
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          onProgress?.({ percent });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            // MaxKey 返回格式: { code: 0, data: "fileId" }
            if (response.code === 0) {
              const fileId = response.data || response;
              // 更新文件状态为成功
              const updatedFile = {
                ...file,
                status: 'done' as const,
                response: response,
              };
              onSuccess?.(fileId, xhr);
              // 手动更新文件列表
              if (options.isEdit) {
                setEditFileList([updatedFile]);
                if (editFormRef.current) {
                  editFormRef.current.setFieldsValue({ pictureId: fileId });
                }
              } else {
                setCreateFileList([updatedFile]);
                if (createFormRef.current) {
                  createFormRef.current.setFieldsValue({ pictureId: fileId });
                }
              }
              message.success('头像上传成功');
            } else {
              onError?.(new Error(response.message || '上传失败'));
              message.error(response.message || '上传失败');
            }
          } catch (e) {
            onSuccess?.(xhr.responseText, xhr);
          }
        } else {
          onError?.(new Error('上传失败'));
          message.error('上传失败');
        }
      });

      xhr.addEventListener('error', () => {
        onError?.(new Error('网络错误'));
        message.error('网络错误');
      });

      xhr.open('POST', '/file/upload/');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    } catch (error) {
      onError?.(error as Error);
      message.error('上传失败');
    }
  };

  // 生成用户表单内容（统一用于新增和编辑）
  const renderUserFormTabs = (isEdit: boolean = false) => {
    return [
      {
        key: 'basic',
        label: '基本信息',
        children: (
          <>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="username"
                  label="用户名"
                  placeholder="请输入用户名"
                  disabled={isEdit}
                  rules={[{ required: true, message: '请输入用户名' }]}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="displayName"
                  label="显示名称"
                  placeholder="请输入显示名称"
                  rules={[{ required: true, message: '请输入显示名称' }]}
                />
              </Col>
            </Row>
            {!isEdit && (
              <Row gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <ProFormText.Password
                    name="password"
                    label="密码"
                    placeholder="请输入密码或点击生成按钮"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码至少6个字符' },
                    ]}
                    fieldProps={{
                      addonAfter: (
                        <Button
                          type="primary"
                          onClick={async () => {
                            try {
                              const password = await userService.generatePassword();
                              if (createFormRef?.current) {
                                createFormRef.current.setFieldsValue({ password });
                              }
                              message.success('密码已生成');
                            } catch (error: any) {
                              message.error('生成密码失败');
                            }
                          }}
                        >
                          生成
                        </Button>
                      ),
                    }}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <ProFormTreeSelect
                    name="departmentId"
                    label="所属部门"
                    placeholder="请选择所属部门"
                    request={async () => {
                      if (Array.isArray(treeSelectData)) {
                        return treeSelectData;
                      }
                      return [];
                    }}
                    fieldProps={{
                      showSearch: true,
                      treeNodeFilterProp: 'title',
                    }}
                  />
                </Col>
              </Row>
            )}
            {isEdit && (
              <Row gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <ProFormTreeSelect
                    name="departmentId"
                    label="所属部门"
                    placeholder="请选择所属部门"
                    request={async () => {
                      if (Array.isArray(treeSelectData)) {
                        return treeSelectData;
                      }
                      return [];
                    }}
                    fieldProps={{
                      showSearch: true,
                      treeNodeFilterProp: 'title',
                    }}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <ProFormText
                    name="employeeNumber"
                    label="员工编号"
                    placeholder="请输入员工编号"
                  />
                </Col>
              </Row>
            )}
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormRadio.Group
                  name="gender"
                  label="性别"
                  options={[
                    { label: '男', value: 1 },
                    { label: '女', value: 2 },
                  ]}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <div style={{ marginBottom: 4 }}>
                  <div style={{ marginBottom: 2, fontSize: '13px' }}>头像</div>
                  <Upload
                    listType="picture-card"
                    fileList={isEdit ? editFileList : createFileList}
                    onChange={isEdit ? handleEditUploadChange : handleCreateUploadChange}
                    onPreview={handlePreview}
                    customRequest={(options) => customRequest({ ...options, isEdit })}
                    accept="image/*"
                    maxCount={1}
                    name="uploadFile"
                  >
                    {(isEdit ? editFileList : createFileList).length >= 1 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 4 }}>上传</div>
                      </div>
                    )}
                  </Upload>
                  <ProFormText name="pictureId" hidden />
                </div>
              </Col>
            </Row>
            {!isEdit && (
              <Row gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <ProFormText
                    name="employeeNumber"
                    label="员工编号"
                    placeholder="请输入员工编号"
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <ProFormText
                    name="windowsAccount"
                    label="Windows账户"
                    placeholder="请输入Windows账户"
                  />
                </Col>
              </Row>
            )}
            {isEdit && (
              <Row gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <ProFormText
                    name="windowsAccount"
                    label="Windows账户"
                    placeholder="请输入Windows账户"
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  {/* 占位，保持两列布局 */}
                </Col>
              </Row>
            )}
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="mobile"
                  label="手机号"
                  placeholder="请输入手机号"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="email"
                  label="邮箱"
                  placeholder="请输入邮箱"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormSelect
                  name="userType"
                  label="用户类型"
                  placeholder="请选择用户类型"
                  rules={isEdit ? [] : [{ required: true, message: '请选择用户类型' }]}
                  options={[
                    { label: '员工', value: 'EMPLOYEE' },
                    { label: '供应商', value: 'SUPPLIER' },
                    { label: '客户', value: 'CUSTOMER' },
                    { label: '承包商', value: 'CONTRACTOR' },
                    { label: '经销商', value: 'DEALER' },
                    { label: '合作伙伴', value: 'PARTNER' },
                    { label: '外部', value: 'EXTERNAL' },
                    { label: '实习生', value: 'INTERN' },
                    { label: '临时', value: 'TEMP' },
                  ]}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormSelect
                  name="userState"
                  label="用户状态"
                  placeholder="请选择用户状态"
                  rules={isEdit ? [] : [{ required: true, message: '请选择用户状态' }]}
                  options={[
                    { label: '常住', value: 'RESIDENT' },
                    { label: '已撤回', value: 'WITHDRAWN' },
                    { label: '未激活', value: 'INACTIVE' },
                    { label: '退休', value: 'RETIREE' },
                  ]}
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormDigit
                  name="sortIndex"
                  label="排序索引"
                  min={1}
                  max={100000}
                  fieldProps={{ precision: 0 }}
                  rules={isEdit ? [] : [{ required: true, message: '请输入排序索引' }]}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormSelect
                  name="status"
                  label="状态"
                  rules={isEdit ? [] : [{ required: true, message: '请选择状态' }]}
                  options={[
                    { label: '启用', value: 1 },
                    { label: '未激活', value: 2 },
                    { label: '禁用', value: 4 },
                    { label: '锁定', value: 5 },
                  ]}
                />
              </Col>
            </Row>
          </>
        ),
      },
      {
        key: 'personal',
        label: '个人信息',
        children: (
          <>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="familyName"
                  label="姓氏"
                  placeholder="请输入姓氏"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="middleName"
                  label="中间名"
                  placeholder="请输入中间名"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="givenName"
                  label="名字"
                  placeholder="请输入名字"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="nickName"
                  label="昵称"
                  placeholder="请输入昵称"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormSelect
                  name="idType"
                  label="证件类型"
                  placeholder="请选择证件类型"
                  options={[
                    { label: '未知', value: 0 },
                    { label: '身份证', value: 1 },
                    { label: '护照', value: 2 },
                    { label: '学生证', value: 3 },
                    { label: '军官证', value: 4 },
                  ]}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="idCardNo"
                  label="证件号"
                  placeholder="请输入证件号"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormSelect
                  name="married"
                  label="婚姻状况"
                  placeholder="请选择婚姻状况"
                  options={[
                    { label: '未知', value: 0 },
                    { label: '未婚', value: 1 },
                    { label: '已婚', value: 2 },
                    { label: '离异', value: 3 },
                    { label: '丧偶', value: 4 },
                  ]}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormDatePicker
                  name="birthDate"
                  label="出生日期"
                  placeholder="请选择出生日期"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="education"
                  label="教育"
                  placeholder="请输入教育"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="graduateFrom"
                  label="毕业院校"
                  placeholder="请输入毕业院校"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormDatePicker
                  name="graduateDate"
                  label="毕业日期"
                  placeholder="请选择毕业日期"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormDatePicker
                  name="startWorkDate"
                  label="开始工作日期"
                  placeholder="请选择开始工作日期"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="timeZone"
                  label="时区"
                  placeholder="请输入时区"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="preferredLanguage"
                  label="首选语言"
                  placeholder="请输入首选语言"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="webSite"
                  label="网站"
                  placeholder="请输入网站"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="defineIm"
                  label="即时通讯"
                  placeholder="请输入即时通讯"
                />
              </Col>
            </Row>
          </>
        ),
      },
      {
        key: 'organization',
        label: '机构信息',
        children: (
          <>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="organization"
                  label="组织"
                  placeholder="请输入组织"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="division"
                  label="部门"
                  placeholder="请输入部门"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="costCenter"
                  label="成本中心"
                  placeholder="请输入成本中心"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="jobLevel"
                  label="职位级别"
                  placeholder="请输入职位级别"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="jobTitle"
                  label="职位"
                  placeholder="请输入职位"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="manager"
                  label="经理"
                  placeholder="请输入经理"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="assistant"
                  label="助理"
                  placeholder="请输入助理"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="workOfficeName"
                  label="办公室名称"
                  placeholder="请输入办公室名称"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormDatePicker
                  name="entryDate"
                  label="入职日期"
                  placeholder="请选择入职日期"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormDatePicker
                  name="quitDate"
                  label="离职日期"
                  placeholder="请选择离职日期"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="workPhoneNumber"
                  label="工作电话"
                  placeholder="请输入工作电话"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="workEmail"
                  label="工作邮箱"
                  placeholder="请输入工作邮箱"
                />
              </Col>
            </Row>
          </>
        ),
      },
      {
        key: 'organizationExt',
        label: '机构扩展',
        children: (
          <>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="workCountry"
                  label="工作国家"
                  placeholder="请输入工作国家"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="workRegion"
                  label="工作地区"
                  placeholder="请输入工作地区"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="workLocality"
                  label="工作城市"
                  placeholder="请输入工作城市"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="workStreetAddress"
                  label="工作街道地址"
                  placeholder="请输入工作街道地址"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="workPostalCode"
                  label="工作邮编"
                  placeholder="请输入工作邮编"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="workFax"
                  label="工作传真"
                  placeholder="请输入工作传真"
                />
              </Col>
            </Row>
          </>
        ),
      },
      {
        key: 'home',
        label: '家庭信息',
        children: (
          <>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="homeEmail"
                  label="家庭邮箱"
                  placeholder="请输入家庭邮箱"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="homePhoneNumber"
                  label="家庭电话"
                  placeholder="请输入家庭电话"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="homeFax"
                  label="家庭传真"
                  placeholder="请输入家庭传真"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="homePostalCode"
                  label="家庭邮编"
                  placeholder="请输入家庭邮编"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="homeCountry"
                  label="家庭国家"
                  placeholder="请输入家庭国家"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="homeRegion"
                  label="家庭地区"
                  placeholder="请输入家庭地区"
                />
              </Col>
            </Row>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="homeLocality"
                  label="家庭城市"
                  placeholder="请输入家庭城市"
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <ProFormText
                  name="homeStreetAddress"
                  label="家庭街道地址"
                  placeholder="请输入家庭街道地址"
                />
              </Col>
            </Row>
          </>
        ),
      },
    ];
  };

  // 状态图标渲染
  const renderStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <CheckCircleOutlined style={{ color: 'green', fontSize: 16 }} title="启用" />;
      case 2:
        return <WarningOutlined style={{ color: 'gray', fontSize: 16 }} title="未激活" />;
      case 4:
        return <StopOutlined style={{ color: 'gray', fontSize: 16 }} title="禁用" />;
      case 5:
        return <LockOutlined style={{ color: 'orange', fontSize: 16 }} title="锁定" />;
      case 9:
        return <CloseCircleOutlined style={{ color: 'red', fontSize: 16 }} title="已删除" />;
      default:
        return null;
    }
  };

  // 表格列定义
  const columns: ProColumns<UserInfo>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      fixed: 'left',
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      width: 120,
    },
    {
      title: '员工编号',
      dataIndex: 'employeeNumber',
      width: 120,
      search: false,
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 150,
      search: false,
      ellipsis: true,
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      width: 120,
      search: false,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      search: false,
      render: (_, record) => {
        return record.gender === 1 ? '男' : '女';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      search: false,
      render: (_, record) => {
        return renderStatusIcon(record.status);
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        const menuItems: MenuProps['items'] = [];
        
        if (record.status === 1) {
          menuItems.push(
            { key: 'groups', label: '用户组' },
            { key: 'password', label: '修改密码' },
            { key: 'mfa', label: '认证方式' },
            { key: 'lock', label: '锁定', danger: true },
            { key: 'disable', label: '禁用', danger: true },
          );
        } else if (record.status === 2) {
          menuItems.push({ key: 'enable', label: '启用' });
        } else if (record.status === 4) {
          menuItems.push({ key: 'enable', label: '启用' });
        } else if (record.status === 5) {
          menuItems.push({ key: 'unlock', label: '解锁' });
        }
        
        menuItems.push({ key: 'delete', label: '删除', danger: true });
        
        return [
          <Button
          key="edit"
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={async () => {
              try {
                // 从服务器获取完整的用户信息
                const fullUserInfo = await userService.get(record.id);
                setCurrentRecord(fullUserInfo);
                // 初始化头像文件列表
                if (fullUserInfo.pictureBase64 || fullUserInfo.pictureId) {
                  setEditFileList([
                    {
                      uid: fullUserInfo.pictureId || '-1',
                      name: 'avatar.png',
                      status: 'done',
                      url: fullUserInfo.pictureBase64 || undefined,
                    },
                  ]);
                } else {
                  setEditFileList([]);
                }
                setEditModalVisible(true);
              } catch (error: any) {
                message.error('获取用户信息失败');
                console.error('获取用户信息失败:', error);
              }
            }}
          >
            编辑
          </Button>,
          <Dropdown
            key="more"
            menu={{
              items: menuItems,
              onClick: ({ key }) => {
                if (key === 'password') {
                  setCurrentRecord(record);
                  setPasswordModalVisible(true);
                } else if (key === 'mfa') {
                  setCurrentRecord(record);
                  setMfaModalVisible(true);
                } else if (key === 'lock') {
                  Modal.confirm({
                    title: '锁定用户',
                    content: `确定要锁定用户 "${record.username}" 吗？`,
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => handleUpdateStatus(record.id, 5, '锁定'),
                  });
                } else if (key === 'unlock') {
                  Modal.confirm({
                    title: '解锁用户',
                    content: `确定要解锁用户 "${record.username}" 吗？`,
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => handleUpdateStatus(record.id, 1, '解锁'),
                  });
                } else if (key === 'enable') {
                  Modal.confirm({
                    title: '启用用户',
                    content: `确定要启用用户 "${record.username}" 吗？`,
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => handleUpdateStatus(record.id, 1, '启用'),
                  });
                } else if (key === 'disable') {
                  Modal.confirm({
                    title: '禁用用户',
                    content: `确定要禁用用户 "${record.username}" 吗？`,
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => handleUpdateStatus(record.id, 4, '禁用'),
                  });
            } else if (key === 'delete') {
                  handleDelete(record.id, record.username);
                } else if (key === 'groups') {
                  // TODO: 导航到用户组页面
                  message.info('用户组功能待实现');
                }
              },
            }}
          >
            <Button type="link" size="small" icon={<MoreOutlined />}>
              更多
            </Button>
          </Dropdown>,
        ];
      },
    },
  ];

  // 加载表格数据
  const loadData = async (params: any) => {
    try {
      // 使用 ref 存储的部门ID（如果存在），确保能获取到最新值
      const currentDepartmentId = selectedDepartmentId;
      // 确保 departmentId 是字符串类型
      const departmentIdStr = currentDepartmentId ? String(currentDepartmentId) : undefined;
      
      // 合并搜索参数和部门ID
      const requestParams: any = {
        ...params,
        ...searchParams,
        // 添加时间戳确保每次请求都是新的（用于强制刷新）
        _t: Date.now(),
      };
      
      // 只有当选择了部门时才添加 departmentId 参数
      // 默认不传 departmentId 会返回所有数据（Angular 版本逻辑）
      if (departmentIdStr) {
        requestParams.departmentId = departmentIdStr;
      }
      
      // 移除空值参数（但保留 _t 时间戳和 departmentId）
      Object.keys(requestParams).forEach(key => {
        if (key !== '_t' && key !== 'departmentId' && (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined)) {
          delete requestParams[key];
        }
      });
      
      console.log('=== 加载用户列表 ===');
      console.log('当前选中的 departmentId:', currentDepartmentId);
      console.log('使用的 departmentId:', departmentIdStr);
      console.log('请求参数:', requestParams);
      
      const result: any = await userService.fetch(requestParams);
      console.log('用户列表API响应:', result);
      
      let records: UserInfo[] = [];
      let total = 0;
      
      if (result && typeof result === 'object') {
        if (result.data && typeof result.data === 'object') {
          if (Array.isArray(result.data.rows)) {
            records = result.data.rows;
            total = result.data.records || result.data.total || result.data.rows.length;
            console.log('使用 result.data.rows，记录数:', records.length, '总数:', total);
          } else if (Array.isArray(result.data.records)) {
            records = result.data.records;
            total = result.data.total || result.data.records.length;
            console.log('使用 result.data.records，记录数:', records.length, '总数:', total);
          } else if (Array.isArray(result.data)) {
            records = result.data;
            total = result.data.length;
            console.log('使用 result.data（数组），记录数:', records.length);
          }
        } else if (Array.isArray(result.rows)) {
          records = result.rows;
          total = result.records || result.total || result.rows.length;
          console.log('使用 result.rows，记录数:', records.length, '总数:', total);
        } else if (Array.isArray(result.records)) {
          records = result.records;
          total = result.total || result.records.length;
          console.log('使用 result.records，记录数:', records.length, '总数:', total);
        } else if (Array.isArray(result)) {
          records = result;
          total = result.length;
          console.log('使用 result（数组），记录数:', records.length);
        }
      }
      
      if (!Array.isArray(records)) {
        console.warn('用户列表数据格式不正确，返回空数组。原始数据:', result);
        records = [];
        total = 0;
      }
      
      console.log('最终返回数据，记录数:', records.length, '总数:', total);
      
      return {
        data: records,
        success: true,
        total,
      };
    } catch (error: any) {
      console.error('加载用户列表失败:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '加载用户列表失败';
      message.error(errorMessage);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 搜索
  const handleSearch = (values: any) => {
    setSearchParams(values);
    actionRef.current?.reload();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({});
    actionRef.current?.reload();
  };

  // 创建用户
  const handleCreate = async (values: any) => {
    try {
      await userService.add(values);
      message.success('创建用户成功');
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '创建用户失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 更新用户
  const handleUpdate = async (values: any) => {
    if (!currentRecord) return false;
    try {
      await userService.update({ ...currentRecord, ...values });
      message.success('更新用户成功');
      setEditModalVisible(false);
      setCurrentRecord(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '更新用户失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 更新状态
  const handleUpdateStatus = async (userId: string, status: number, actionName: string) => {
    try {
      await userService.updateStatus({ id: userId, status });
      message.success(`${actionName}成功`);
      actionRef.current?.reload();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || `${actionName}失败`;
      message.error(errorMessage);
    }
  };

  // 删除用户（带确认）
  const handleDelete = (userId: string, username: string) => {
    Modal.confirm({
      title: '删除用户',
      content: `确定要删除用户 "${username}" 吗？删除后无法恢复！`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await userService.delete(userId);
          message.success('删除用户成功');
          actionRef.current?.reload();
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || error?.message || '删除用户失败';
          message.error(errorMessage);
        }
      },
    });
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户');
      return;
    }
    try {
      await userService.batchDelete(selectedRowKeys as string[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '批量删除失败';
      message.error(errorMessage);
    }
  };

  // 生成随机密码
  const handleGeneratePassword = async () => {
    try {
      const password = await userService.generatePassword();
      // 设置到表单中
      const form = document.querySelector('form');
      if (form) {
        const passwordInput = form.querySelector('input[name="newPassword"]') as HTMLInputElement;
        const confirmInput = form.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
        if (passwordInput) passwordInput.value = password;
        if (confirmInput) confirmInput.value = password;
      }
      message.success('密码已生成');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '生成密码失败';
      message.error(errorMessage);
    }
  };

  // 重置密码
  const handlePasswordReset = async (values: any) => {
    if (!currentRecord) return false;
    try {
      await userService.resetPassword({
        id: currentRecord.id,
        password: values.newPassword,
      });
      message.success('密码重置成功');
      setPasswordModalVisible(false);
      setCurrentRecord(undefined);
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '密码重置失败';
      message.error(errorMessage);
      return false;
    }
  };

  // 更新 MFA 认证方式
  const handleMfaUpdate = async (values: any) => {
    if (!currentRecord) return false;
    try {
      await userService.updateAuthnType({
        id: currentRecord.id,
        authnType: values.authnType,
      });
      message.success('认证方式更新成功');
      setMfaModalVisible(false);
      setCurrentRecord(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '认证方式更新失败';
      message.error(errorMessage);
      return false;
    }
  };

  return (
    <div className="user-list-page">
      <PageContainer
        header={{
          // title: '用户管理',
          breadcrumb: {
            items: [
              { title: '首页' },
              { title: '身份管理' },
              { title: '用户管理' },
            ],
          },
        }}
      >
        <ProCard>
          <Row gutter={[8, 8]}>
            {/* 左侧组织树 */}
            <Col xs={24} sm={24} md={8} lg={6} xl={6}>
              <ProCard
                title="组织树"
                extra={
                  <Space>
                    <Button size="small" icon={<ReloadOutlined />} onClick={loadOrgTree}>
                      刷新
                    </Button>
                  </Space>
                }
                bodyStyle={{ 
                  padding: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="grid-border organization-tree-card"
              >
                <Spin spinning={loading}>
                  <div className="organization-tree-container">
                    <Tree
                      showLine={false}
                      blockNode
                      expandedKeys={expandedKeys}
                      onExpand={(keys) => {
                        setExpandedKeys(keys as React.Key[]);
                      }}
                      selectedKeys={selectedOrgId ? [selectedOrgId] : []}
                      onSelect={handleSelectNode}
                      treeData={treeData}
                    />
                  </div>
                </Spin>
              </ProCard>
            </Col>

            {/* 右侧用户列表 */}
            <Col xs={24} sm={24} md={16} lg={18} xl={18} style={{ overflow: 'hidden' }}>
              <div className="grid-border" style={{ width: '100%', overflow: 'hidden' }}>
                <ProTable<UserInfo>
              actionRef={actionRef}
              columns={columns}
              request={loadData}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          collapsed: false,
        }}
        form={{
          onValuesChange: (_changedValues, allValues) => {
            setSearchParams(allValues);
          },
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建用户
          </Button>,
          <Popconfirm
            key="batchDelete"
            title="确定要批量删除选中的用户吗？"
            onConfirm={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
          >
            <Button
              danger
              disabled={selectedRowKeys.length === 0}
              icon={<DeleteOutlined />}
            >
              批量删除
            </Button>
          </Popconfirm>,
        ]}
        rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              size="small"
              bordered
              scroll={{ x: 'max-content' }}
              style={{ width: '100%' }}
            />
              </div>
            </Col>
          </Row>
        </ProCard>

      {/* 新建用户对话框 */}
      <ModalForm
        title="新建用户"
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible);
          if (visible) {
            setCreateFileList([]);
          }
        }}
        onFinish={handleCreate}
        width={800}
        formRef={createFormRef}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={{
          status: 1,
          gender: 1,
          userType: 'EMPLOYEE',
          userState: 'RESIDENT',
          sortIndex: 1,
          departmentId: selectedDepartmentId || undefined,
        }}
      >
        <Tabs items={renderUserFormTabs(false)} />
      </ModalForm>

      {/* 编辑用户对话框 */}
      <ModalForm
        title="编辑用户"
        open={editModalVisible}
        onOpenChange={(visible) => {
          setEditModalVisible(visible);
          if (!visible) {
            setCurrentRecord(undefined);
            setEditFileList([]);
          }
        }}
        onFinish={handleUpdate}
        width={800}
        formRef={editFormRef}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={currentRecord}
        key={currentRecord?.id}
      >
        <Tabs items={renderUserFormTabs(true)} />
      </ModalForm>

      {/* 重置密码对话框 */}
      <ModalForm
        title={`重置密码 - ${currentRecord?.username}`}
        open={passwordModalVisible}
        onOpenChange={setPasswordModalVisible}
        onFinish={handlePasswordReset}
        width={500}
        formRef={passwordFormRef}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={{
          username: currentRecord?.username,
          displayName: currentRecord?.displayName,
        }}
      >
        <ProFormText
          name="username"
          label="用户名"
          disabled
        />
        <ProFormText
          name="displayName"
          label="显示名称"
          disabled
        />
        <ProFormText.Password
          name="newPassword"
          label="新密码"
          placeholder="请输入新密码或点击生成按钮"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码至少6个字符' },
          ]}
          fieldProps={{
            addonAfter: (
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    const password = await userService.generatePassword();
                    // 使用 formRef 设置值
                    if (passwordFormRef.current) {
                      passwordFormRef.current.setFieldsValue({
                        newPassword: password,
                        confirmPassword: password,
                      });
                    }
                    message.success('密码已生成');
                  } catch (error: any) {
                    message.error('生成密码失败');
                  }
                }}
              >
                生成
              </Button>
            ),
          }}
        />
        <ProFormText.Password
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        />
      </ModalForm>

      {/* MFA 对话框 */}
      <ModalForm
        title={`认证方式 - ${currentRecord?.username}`}
        open={mfaModalVisible}
        onOpenChange={setMfaModalVisible}
        onFinish={handleMfaUpdate}
        width={500}
        modalProps={{
          destroyOnClose: true,
        }}
        initialValues={{
          id: currentRecord?.id,
          username: currentRecord?.username,
          displayName: currentRecord?.displayName,
          authnType: currentRecord?.authnType || '0',
        }}
      >
        <ProFormText
          name="id"
          hidden
        />
        <ProFormText
          name="username"
          label="用户名"
          disabled
        />
        <ProFormText
          name="displayName"
          label="显示名称"
          disabled
        />
        <ProFormSelect
          name="authnType"
          label="认证方式"
          placeholder="请选择认证方式"
          rules={[{ required: true, message: '请选择认证方式' }]}
          options={[
            { label: '用户名密码', value: '0' },
            { label: '短信验证码', value: '1' },
            { label: '邮箱验证码', value: '2' },
            { label: 'TOTP', value: '3' },
          ]}
        />
      </ModalForm>

      {/* 头像预览模态框 */}
      <Modal
        open={previewVisible}
        title="预览头像"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </PageContainer>
    </div>
  );
};

export default UserList;
