import { useState, useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import dayjs from 'dayjs';
import systemLogService, { SystemLog } from '@/services/system-log.service';

const SystemLogList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [expandForm, setExpandForm] = useState(false);

  const columns: ProColumns<SystemLog>[] = [
    {
      title: '主题',
      dataIndex: 'topic',
      width: 200,
      ellipsis: true,
    },
    {
      title: '内容',
      dataIndex: 'message',
      width: 300,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'messageAction',
      width: 150,
      ellipsis: true,
    },
    {
      title: '结果',
      dataIndex: 'messageResult',
      width: 150,
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'displayName',
      width: 120,
    },
    {
      title: '执行时间',
      dataIndex: 'executeTime',
      width: 180,
    },
  ];

  const loadData = async (params: any) => {
    try {
      const requestParams: any = {
        username: params.username || '',
        displayName: params.displayName || '',
        employeeNumber: params.employeeNumber || '',
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
        pageSizeOptions: [10, 20, 50],
      };

      // 如果展开表单，添加日期参数
      if (expandForm && params.startDate && params.endDate) {
        requestParams.startDate = dayjs(params.startDate).format('YYYY-MM-DD HH:mm:ss');
        requestParams.endDate = dayjs(params.endDate).format('YYYY-MM-DD HH:mm:ss');
        requestParams.startDatePicker = dayjs(params.startDate).valueOf();
        requestParams.endDatePicker = dayjs(params.endDate).valueOf();
      } else {
        requestParams.startDate = '';
        requestParams.endDate = '';
      }

      const result: any = await systemLogService.fetch(requestParams);
      
      // 处理返回结果
      // 响应拦截器已经提取了 data 部分，所以 result 直接是 { rows: [], records: 157, ... }
      let rows: SystemLog[] = [];
      let records = 0;
      
      if (result) {
        // 优先检查 rows 字段（MaxKey 标准格式）
        if (Array.isArray(result.rows)) {
          rows = result.rows;
          records = result.records || result.total || 0;
        } 
        // 检查嵌套的 data.rows
        else if (result.data && Array.isArray(result.data.rows)) {
          rows = result.data.rows;
          records = result.data.records || result.data.total || 0;
        }
        // 检查 records 字段（另一种格式）
        else if (Array.isArray(result.records)) {
          rows = result.records;
          records = result.total || 0;
        }
        // 检查 data 字段是否为数组
        else if (Array.isArray(result.data)) {
          rows = result.data;
          records = result.total || result.records || 0;
        }
        // 如果 result 本身就是数组
        else if (Array.isArray(result)) {
          rows = result;
        }
      }

      return {
        data: rows,
        success: true,
        total: records,
      };
    } catch (error: any) {
      console.error('加载系统日志失败:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  return (
    <PageContainer>
      <ProTable<SystemLog>
        headerTitle="系统日志"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          collapsed: !expandForm,
          onCollapse: setExpandForm,
          searchText: '查询',
          resetText: '重置',
          optionRender: (_searchConfig, _formProps, dom) => [
            ...dom.reverse(),
            <Button
              key="expand"
              onClick={() => {
                setExpandForm(!expandForm);
                actionRef.current?.reload();
              }}
            >
              {expandForm ? '收起' : '展开'}
            </Button>,
          ],
        }}
        request={loadData}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50'],
          showSizeChanger: true,
        }}
        dateFormatter="string"
        form={{
          initialValues: {
            startDate: dayjs().subtract(30, 'day'),
            endDate: dayjs(),
          },
        }}
      />
    </PageContainer>
  );
};

export default SystemLogList;

