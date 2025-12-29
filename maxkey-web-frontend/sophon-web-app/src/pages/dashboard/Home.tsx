import { useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProFormText,
  ProList,
  QueryFilter,
} from '@ant-design/pro-components';
import { Avatar, Badge, Card, Typography, message } from 'antd';
import type { Application } from '@/types/entity';
import appListService from '@/services/app-list.service';
import appCategoryService from '@/services/app-category.service';
import { getAppIconUrl } from '@/utils/iconGenerator';
import './Home.less';

const { Paragraph } = Typography;
const prefixCls = 'topiam-app-list';
const all = 'all';

const renderBadge = (count: number, active = false) => {
  return (
    <Badge
      count={count}
      style={{
        marginBlockStart: -2,
        marginInlineStart: 4,
        color: active ? '#1890FF' : '#999',
        backgroundColor: active ? '#E6F7FF' : '#eee',
      }}
    />
  );
};

const Home: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentGroup, setCurrentGroup] = useState<React.Key>(all);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [appCategoryList] = useState(appCategoryService.list());
  const [loading, setLoading] = useState<boolean>(false);
  const baseUrl = window.location.origin;

  // 获取应用图标 URL（使用工具函数）
  const getAppIcon = (app: Application): string => {
    return getAppIconUrl(app.appName || '', '', '', '');
  };

  const initSso = (app: Application) => {
    if (app.protocol === 'Basic' || app.inducer === 'SP') {
      window.open(app.loginUrl);
      return;
    }
    window.open(`${baseUrl}/authz/${app.id}`);
  };

  const getItems = () => {
    let data: { key: string; label: React.JSX.Element }[] = [
      {
        key: all,
        label: (
          <span>
            全部
            {renderBadge(0, currentGroup === all)}
          </span>
        ),
      },
    ];
    appCategoryList.forEach((item) => {
      data.push({
        key: item.id,
        label: (
          <span>
            {item.name}
            {renderBadge(0, currentGroup === item.id)}
          </span>
        ),
      });
    });
    return data;
  };

  const queryAppList = async (params: Record<string, any>) => {
    try {
      setLoading(true);
      const apps = await appListService.appList();
      
      // 根据分类筛选
      let filteredApps = apps;
      if (params.category && params.category !== all) {
        filteredApps = apps.filter((app) => app.category === params.category);
      }
      
      // 根据名称搜索
      if (params.name) {
        filteredApps = filteredApps.filter((app) =>
          app.appName?.toLowerCase().includes(params.name.toLowerCase())
        );
      }

      return {
        data: filteredApps,
        success: true,
        total: filteredApps.length,
      };
    } catch (error: any) {
      console.error('加载应用列表失败:', error);
      message.error('加载应用列表失败');
      return {
        data: [],
        success: false,
        total: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={prefixCls}>
      <PageContainer className={prefixCls}>
        <ProList<Application>
          rowKey="id"
          split
          grid={{
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 5,
          }}
          loading={loading}
          onLoadingChange={(loading) => {
            if (typeof loading === 'boolean') {
              setLoading(loading);
            }
          }}
          request={async (params) => {
            return queryAppList({ ...searchParams, ...params });
          }}
          pagination={{}}
          toolbar={{
            menu: {
              type: 'tab',
              activeKey: currentGroup,
              items: getItems(),
              onChange(key) {
                if (key) {
                  setCurrentGroup(key);
                  if (key === all) {
                    setSearchParams((values) => {
                      return { ...values, category: undefined };
                    });
                  } else {
                    setSearchParams((values) => {
                      return { ...values, category: key };
                    });
                  }
                  actionRef.current?.reload();
                }
              },
            },
          }}
          params={searchParams}
          actionRef={actionRef}
          renderItem={(item: Application) => {
            return (
              item &&
              item.id && (
                <Card
                  style={{ margin: 8 }}
                  className={`${prefixCls}-item-card`}
                  hoverable
                  bordered={false}
                  onClick={async () => {
                    initSso(item);
                    return;
                  }}
                >
                  <div className={`${prefixCls}-item-content-wrapper`} key={item.id}>
                    <div className={`${prefixCls}-item-avatar`}>
                      <Avatar
                        key={getAppIcon(item)}
                        shape="square"
                        src={getAppIcon(item)}
                        size={45}
                      />
                    </div>
                    <div className={`${prefixCls}-item-content`}>
                      <span className={`${prefixCls}-item-content-title`}>
                        {item.appName}
                      </span>
                      <Paragraph
                        className={`${prefixCls}-item-content-desc`}
                        ellipsis={{ tooltip: item.description, rows: 2 }}
                        title={item.description}
                      >
                        {item.description ? item.description : <>&nbsp;</>}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              )
            );
          }}
          tableExtraRender={() => {
            return (
              <ProCard bodyStyle={{ padding: 0 }}>
                <QueryFilter
                  layout="horizontal"
                  onFinish={(values) => {
                    setSearchParams({ ...searchParams, ...values });
                    actionRef.current?.reload();
                    return Promise.resolve();
                  }}
                  onReset={() => {
                    if (currentGroup && currentGroup !== all) {
                      setSearchParams({ category: currentGroup });
                    } else {
                      setSearchParams({});
                    }
                    actionRef.current?.reload();
                  }}
                >
                  <ProFormText name="name" label="应用名称" />
                </QueryFilter>
              </ProCard>
            );
          }}
        />
      </PageContainer>
    </div>
  );
};

export default Home;

