import { ProCard } from '@ant-design/pro-components';
import { useState, useEffect, useRef } from 'react';
import { Table, Tabs, Skeleton } from 'antd';
import type { TabsProps } from 'antd';
import * as echarts from 'echarts';
import chinaJson from './china.json';
import dashboardService from '@/services/dashboard.service';

// 动态导入 world.json（如果文件存在）
let worldJson: any = null;
try {
  worldJson = require('./world.json');
} catch (e) {
  console.warn('world.json 文件不存在，世界地图将使用占位符');
}

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeKey, setActiveKey] = useState<string>('china');
  const chinaMapRef = useRef<HTMLDivElement>(null);
  const worldMapRef = useRef<HTMLDivElement>(null);
  const chinaChartInstance = useRef<echarts.ECharts | null>(null);
  const worldChartInstance = useRef<echarts.ECharts | null>(null);

  const [provinceData, setProvinceData] = useState<Array<{ name: string; value: number; provinceName: string }>>([]);
  const [provinceTableData, setProvinceTableData] = useState<Array<{ reportstring: string; reportcount: number }>>([]);
  
  const [countryData, setCountryData] = useState<Array<{ name: string; value: number }>>([]);
  const [countryTableData, setCountryTableData] = useState<Array<{ reportstring: string; reportcount: number }>>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeKey === 'china' && provinceData.length > 0) {
      setTimeout(() => renderChinaMap(), 100);
    } else if (activeKey === 'world' && countryData.length > 0) {
      setTimeout(() => renderWorldMap(), 100);
    }
  }, [activeKey, provinceData, countryData]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 加载省份数据
      const provinces = await dashboardService.getProvinceStats();
      setProvinceTableData(provinces);
      
      const provinceMapData = provinces.map(item => ({
        name: item.name || item.reportstring,
        value: item.reportcount,
        provinceName: item.reportstring,
      }));
      setProvinceData(provinceMapData);

      // 加载国家数据
      const countries = await dashboardService.getCountryStats();
      setCountryTableData(countries);
      
      const countryMapData = countries.map(item => ({
        name: item.reportstring,
        value: item.reportcount,
      }));
      setCountryData(countryMapData);

    } catch (error) {
      console.error('加载地图数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChinaMap = () => {
    if (!chinaMapRef.current) return;

    // 注册中国地图
    echarts.registerMap('china', chinaJson as any);

    // 初始化或获取实例
    const instance = echarts.getInstanceByDom(chinaMapRef.current) || echarts.init(chinaMapRef.current);
    chinaChartInstance.current = instance;

    const maxValue = Math.max(...provinceData.map(item => item.value), 1);

    const option = {
      backgroundColor: '#FFFFFF',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      visualMap: {
        show: true,
        left: 'left',
        min: 0,
        max: maxValue,
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        },
      },
      series: [
        {
          name: '访问量',
          type: 'map',
          roam: true,
          map: 'china',
          emphasis: {
            label: {
              show: true,
            },
            itemStyle: {
              areaColor: '#ffeaa7',
            },
          },
          label: {
            show: true,
            fontSize: 10,
          },
          itemStyle: {
            areaColor: '#e0f3f8',
            borderColor: '#999',
          },
          data: provinceData,
        },
      ],
    };

    instance.setOption(option);
  };

  const renderWorldMap = () => {
    if (!worldMapRef.current || countryData.length === 0) return;

    // 动态计算颜色分段
    const maxMapCount = Math.max(...countryData.map(item => item.value), 1);
    const mapColor = ['#DC143C', '#33A1C9', '#EE82EE', '#4B0082', '#5475f5', '#9feaa5', '#85daef', '#e6ac53', '#FAEBD7', '#F0F8FF'];
    let mapSplitList: Array<{ start: number; end: number }> = [];

    if (maxMapCount <= 100) {
      mapSplitList = [
        { start: 90, end: 100 },
        { start: 80, end: 90 },
        { start: 70, end: 80 },
        { start: 60, end: 70 },
        { start: 50, end: 60 },
        { start: 40, end: 50 },
        { start: 30, end: 40 },
        { start: 20, end: 30 },
        { start: 10, end: 20 },
        { start: 0, end: 10 }
      ];
    } else if (maxMapCount <= 500) {
      mapSplitList = [
        { start: 450, end: 500 },
        { start: 400, end: 450 },
        { start: 350, end: 400 },
        { start: 300, end: 350 },
        { start: 250, end: 300 },
        { start: 200, end: 250 },
        { start: 150, end: 200 },
        { start: 100, end: 150 },
        { start: 50, end: 100 },
        { start: 0, end: 50 }
      ];
    } else if (maxMapCount <= 1000) {
      mapSplitList = [
        { start: 900, end: 1000 },
        { start: 800, end: 900 },
        { start: 700, end: 800 },
        { start: 600, end: 700 },
        { start: 500, end: 600 },
        { start: 400, end: 500 },
        { start: 300, end: 400 },
        { start: 200, end: 300 },
        { start: 100, end: 200 },
        { start: 0, end: 100 }
      ];
    } else if (maxMapCount <= 5000) {
      mapSplitList = [
        { start: 4500, end: 5000 },
        { start: 4000, end: 4500 },
        { start: 3500, end: 4000 },
        { start: 3000, end: 3500 },
        { start: 2500, end: 3000 },
        { start: 2000, end: 2500 },
        { start: 1500, end: 2000 },
        { start: 1000, end: 1500 },
        { start: 500, end: 1000 },
        { start: 0, end: 500 }
      ];
    } else if (maxMapCount <= 10000) {
      mapSplitList = [
        { start: 9000, end: 10000 },
        { start: 8000, end: 9000 },
        { start: 7000, end: 8000 },
        { start: 6000, end: 7000 },
        { start: 5000, end: 6000 },
        { start: 4000, end: 5000 },
        { start: 3000, end: 4000 },
        { start: 2000, end: 3000 },
        { start: 1000, end: 2000 },
        { start: 0, end: 1000 }
      ];
    } else if (maxMapCount <= 50000) {
      mapSplitList = [
        { start: 45000, end: 50000 },
        { start: 40000, end: 45000 },
        { start: 35000, end: 40000 },
        { start: 30000, end: 35000 },
        { start: 25000, end: 30000 },
        { start: 20000, end: 25000 },
        { start: 15000, end: 20000 },
        { start: 10000, end: 15000 },
        { start: 5000, end: 10000 },
        { start: 0, end: 5000 }
      ];
    } else if (maxMapCount <= 100000) {
      mapSplitList = [
        { start: 90000, end: 100000 },
        { start: 80000, end: 90000 },
        { start: 70000, end: 80000 },
        { start: 60000, end: 70000 },
        { start: 50000, end: 60000 },
        { start: 40000, end: 50000 },
        { start: 30000, end: 40000 },
        { start: 20000, end: 30000 },
        { start: 10000, end: 20000 },
        { start: 0, end: 10000 }
      ];
    }

    // 为每个国家数据分配颜色
    const worldMapData = countryData.map(item => {
      let color = mapColor[mapColor.length - 1];
      for (let si = 0; si < mapSplitList.length; si++) {
        if (mapSplitList[si].start < item.value && item.value <= mapSplitList[si].end) {
          color = mapColor[si];
          break;
        }
      }
      return {
        value: item.value,
        name: item.name,
        itemStyle: { color }
      };
    });

    const instance = echarts.getInstanceByDom(worldMapRef.current) || echarts.init(worldMapRef.current);
    worldChartInstance.current = instance;

    // 如果 world.json 存在，注册地图
    if (worldJson) {
      echarts.registerMap('world', { geoJSON: worldJson });
    }

    const option: any = {
      backgroundColor: '#FFFFFF',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      visualMap: {
        show: true,
        left: 'left',
        y: 'center',
        splitList: mapSplitList,
        color: mapColor,
      },
      series: [
        {
          name: '数据',
          type: 'map',
          mapType: worldJson ? 'world' : undefined,
          map: worldJson ? 'world' : undefined,
          roam: true,
          label: {
            show: false, // 国家名称默认不显示
          },
          emphasis: {
            label: {
              show: false,
            },
          },
          data: worldMapData,
        },
      ],
    };

    // 如果没有 world.json，使用 geo 配置作为占位符
    if (!worldJson) {
      option.geo = {
        map: 'world',
        roam: true,
        emphasis: {
          label: {
            show: true,
          },
          itemStyle: {
            areaColor: '#ffeaa7',
          },
        },
        itemStyle: {
          areaColor: '#e0f3f8',
          borderColor: '#999',
        },
      };
      option.series = [
        {
          name: '访问量',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [], // 世界地图需要坐标数据
        },
      ];
    }

    instance.setOption(option);
  };

  useEffect(() => {
    const handleResize = () => {
      chinaChartInstance.current?.resize();
      worldChartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chinaChartInstance.current?.dispose();
      worldChartInstance.current?.dispose();
    };
  }, []);

  const columns = [
    {
      title: '序号',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: activeKey === 'china' ? '省份' : '国家',
      dataIndex: 'reportstring',
      key: 'location',
    },
    {
      title: '浏览量(PV)',
      dataIndex: 'reportcount',
      key: 'visits',
      width: 120,
    },
  ];

  const top10ProvinceData = provinceTableData.slice(0, 10);
  const top10CountryData = countryTableData.slice(0, 10);

  const items: TabsProps['items'] = [
    {
      key: 'china',
      label: '中国地图',
      children: (
        <div style={{ display: 'flex', gap: 16 }}>
          {/* 中国地图 */}
          <div 
            ref={chinaMapRef}
            style={{ 
              flex: 1, 
              height: 450, 
              minHeight: 450,
            }}
          />
          {/* 右侧表格 */}
          <div style={{ width: 280 }}>
            <Table
              columns={columns}
              dataSource={top10ProvinceData}
              pagination={false}
              size="small"
              rowKey="reportstring"
              locale={{ emptyText: '暂无数据' }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'world',
      label: '世界地图',
      children: (
        <div style={{ display: 'flex', gap: 16 }}>
          {/* 世界地图 */}
          <div 
            ref={worldMapRef}
            style={{ 
              flex: 1, 
              height: 450,
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
            }}>
            世界地图（需要world.json数据和坐标）
          </div>
          {/* 右侧表格 */}
          <div style={{ width: 280 }}>
            <Table
              columns={columns}
              dataSource={top10CountryData}
              pagination={false}
              size="small"
              rowKey="reportstring"
              locale={{ emptyText: '暂无数据' }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <ProCard title="30日TOP10访问统计" headerBordered>
      <Skeleton loading={loading} active paragraph={{ rows: 10 }}>
        <Tabs
          activeKey={activeKey}
          items={items}
          onChange={setActiveKey}
        />
      </Skeleton>
    </ProCard>
  );
};
