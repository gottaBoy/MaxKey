import { useState, useEffect } from 'react';
import { Radio, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { getDensity, setDensity, type Density } from '../utils/theme';

const ThemeDensitySelector: React.FC = () => {
  const [density, setDensityState] = useState<Density>(getDensity());

  useEffect(() => {
    // 监听存储变化（用于多标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme-density' && e.newValue) {
        setDensityState(e.newValue as Density);
        setDensity(e.newValue as Density);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleChange = (e: RadioChangeEvent) => {
    const newDensity = e.target.value as Density;
    setDensityState(newDensity);
    setDensity(newDensity);
  };

  return (
    <Space>
      <span style={{ fontSize: '13px' }}>密度：</span>
      <Radio.Group
        value={density}
        onChange={handleChange}
        size="small"
        buttonStyle="solid"
      >
        <Radio.Button value="loose">宽松</Radio.Button>
        <Radio.Button value="medium">中等</Radio.Button>
        <Radio.Button value="compact">紧凑</Radio.Button>
      </Radio.Group>
    </Space>
  );
};

export default ThemeDensitySelector;

