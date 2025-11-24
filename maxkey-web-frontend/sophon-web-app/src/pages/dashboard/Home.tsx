import { useState, useEffect } from 'react';
import { Card, List, Select, Image, Spin, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import type { Application } from '@/types/entity';
import appListService from '@/services/app-list.service';
import appCategoryService from '@/services/app-category.service';
import './Home.less';

const { Option } = Select;

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [appList, setAppList] = useState<Application[]>([]);
  const [staticAppList, setStaticAppList] = useState<Application[]>([]);
  const [appCategoryList] = useState(appCategoryService.list());
  const [appsCategory, setAppsCategory] = useState<string>('All');
  const baseUrl = window.location.origin;

  useEffect(() => {
    loadAppList();
  }, []);

  const loadAppList = async () => {
    try {
      setLoading(true);
      const apps = await appListService.appList();
      setAppList(apps);
      setStaticAppList(apps);
    } catch (error: any) {
      console.error('加载应用列表失败:', error);
      message.error('加载应用列表失败');
    } finally {
      setLoading(false);
    }
  };

  const changeCategory = (category: string) => {
    setAppsCategory(category);
    if (!category || category === 'All') {
      setAppList(staticAppList);
    } else {
      const filtered = staticAppList.filter((app) => app.category === category);
      setAppList(filtered);
    }
  };

  const onAuthz = (e: React.MouseEvent, appId: string) => {
    e.preventDefault();
    const app = appList.find((a) => a.id === appId);
    if (app && (app.protocol === 'Basic' || app.inducer === 'SP')) {
      window.open(app.loginUrl);
      return;
    }
    window.open(`${baseUrl}/authz/${appId}`);
  };

  const setAccount = (appId: string) => {
    // TODO: 实现账号设置功能
    message.info('账号设置功能待实现');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <Card
          title={
            <div className="card-title">
              <div className="title-icon">
                <Image
                  src="data:image/png;base64,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"
                  alt="应用"
                  width={24}
                  height={24}
                  preview={false}
                />
              </div>
              <div className="title-text">应用</div>
            </div>
          }
          extra={
            <Select
              showSearch
              allowClear
              placeholder="请选择分类"
              style={{ minWidth: 180 }}
              value={appsCategory}
              onChange={changeCategory}
            >
              <Option value="All">全部</Option>
              {appCategoryList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          }
        >
          <Spin spinning={loading}>
            <List
              grid={{
                gutter: 24,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 5,
                xxl: 6,
              }}
              dataSource={appList}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    style={{ textAlign: 'center' }}
                    actions={
                      item.protocol === 'Form_Based'
                        ? [
                            <UserAddOutlined
                              key="account"
                              onClick={() => setAccount(item.id!)}
                              style={{ fontSize: 18 }}
                            />,
                          ]
                        : undefined
                    }
                  >
                    <div className="app-card" onClick={(e) => onAuthz(e, item.id!)}>
                      <Image
                        src={item.iconBase64 || ''}
                        alt={item.appName}
                        width={65}
                        height={65}
                        preview={false}
                        className="app-image"
                      />
                      <p style={{ marginTop: 8, marginBottom: 0 }}>{item.appName}</p>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default Home;

