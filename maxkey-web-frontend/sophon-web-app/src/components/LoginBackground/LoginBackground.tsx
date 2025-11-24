import { useEffect, useRef } from 'react';
import './LoginBackground.less';

// 3D场景类型
type SceneType = 'port' | 'highway' | 'factory' | 'mine';

const LoginBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneType>('port');
  const nextSceneRef = useRef<SceneType | null>(null);
  const rotationRef = useRef(0);
  const transitionProgressRef = useRef(0); // 过渡进度 0-1
  const isTransitioningRef = useRef(false);
  const cameraOffsetRef = useRef(0); // 相机偏移量，用于行进效果

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 场景切换（带过渡效果）
    const scenes: SceneType[] = ['port', 'highway', 'factory', 'mine'];
    let sceneIndex = 0;
    const switchScene = () => {
      if (isTransitioningRef.current) return; // 如果正在过渡，跳过
      
      sceneIndex = (sceneIndex + 1) % scenes.length;
      nextSceneRef.current = scenes[sceneIndex];
      isTransitioningRef.current = true;
      transitionProgressRef.current = 0;
      cameraOffsetRef.current = 0; // 重置相机偏移
    };
    setInterval(switchScene, 10000); // 每10秒切换场景（包含2秒过渡时间）

    // 粒子系统
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      color: string;
      trail: Array<{ x: number; y: number }>;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.3;
        this.color = `rgba(59, 160, 255, ${this.opacity})`;
        this.trail = [];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) {
          this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        
        // 绘制拖尾
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          const alpha = (i / this.trail.length) * this.opacity * 0.5;
          ctx.beginPath();
          ctx.arc(point.x, point.y, this.radius * (i / this.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 160, 255, ${alpha})`;
          ctx.fill();
        }

        // 绘制主粒子
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // 添加光晕
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, `rgba(59, 160, 255, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(59, 160, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 道路轨迹系统
    class RoadPath {
      points: Array<{ x: number; y: number }>;
      progress: number;
      speed: number;
      color: string;
      lightPoints: Array<{ x: number; y: number; radius: number; opacity: number; speed: number }>;

      constructor(color: string = 'rgba(59, 160, 255, 0.3)') {
        this.points = [];
        this.progress = Math.random() * 100;
        this.speed = Math.random() * 0.5 + 0.2;
        this.color = color;
        this.lightPoints = [];
        this.generatePath();
        this.generateLightPoints();
      }

      generatePath() {
        this.points = [];
        const startY = Math.random() * canvas.height;
        const numPoints = 30;
        const amplitude = Math.random() * 80 + 30;
        const frequency = Math.random() * 0.8 + 0.3;
        for (let i = 0; i < numPoints; i++) {
          this.points.push({
            x: (canvas.width / numPoints) * i,
            y: startY + Math.sin(i * frequency + this.progress / 10) * amplitude + (Math.random() - 0.5) * 50,
          });
        }
      }

      generateLightPoints() {
        this.lightPoints = [];
        for (let i = 0; i < 3; i++) {
          this.lightPoints.push({
            x: 0,
            y: 0,
            radius: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.5,
            speed: Math.random() * 2 + 1,
          });
        }
      }

      update() {
        this.progress += this.speed;
        if (this.progress > 100) {
          this.progress = 0;
          this.generatePath();
          this.generateLightPoints();
        }

        this.lightPoints.forEach(lp => {
          const pathIndex = Math.floor((this.progress + lp.speed) % 100 / 100 * (this.points.length - 1));
          if (this.points[pathIndex]) {
            lp.x = this.points[pathIndex].x;
            lp.y = this.points[pathIndex].y;
          }
        });
      }

      draw() {
        if (!ctx || this.points.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.lineDashOffset = -this.progress * 2;

        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // 绘制光点
        this.lightPoints.forEach(lp => {
          ctx.beginPath();
          ctx.arc(lp.x, lp.y, lp.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${lp.opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
          ctx.fill();
          ctx.shadowBlur = 0; // 重置阴影
        });
      }
    }

    // 3D场景绘制类
    class Scene3D {
      drawPort(offsetX: number = 0, opacity: number = 1) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(offsetX, 0);
        
        // 绘制港口场景
        const horizon = canvas.height * 0.6;
        const portX = canvas.width * 0.3;
        const portY = horizon;
        
        // 海面
        const seaGradient = ctx.createLinearGradient(0, horizon, 0, canvas.height);
        seaGradient.addColorStop(0, 'rgba(59, 160, 255, 0.3)');
        seaGradient.addColorStop(1, 'rgba(13, 17, 23, 0.8)');
        ctx.fillStyle = seaGradient;
        ctx.fillRect(0, horizon, canvas.width, canvas.height - horizon);
        
        // 海浪动画
        ctx.strokeStyle = 'rgba(59, 160, 255, 0.4)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          const waveY = horizon + 20 + i * 30 + Math.sin(Date.now() / 1000 + i) * 5;
          ctx.moveTo(0, waveY);
          for (let x = 0; x < canvas.width; x += 10) {
            ctx.lineTo(x, waveY + Math.sin(x / 50 + Date.now() / 1000) * 3);
          }
          ctx.stroke();
        }
        
        // 港口建筑（3D透视）
        const buildings = [
          { x: portX - 100, width: 80, height: 150, depth: 60 },
          { x: portX, width: 100, height: 180, depth: 70 },
          { x: portX + 120, width: 90, height: 140, depth: 65 },
        ];
        
        buildings.forEach((b, i) => {
          const offset = Math.sin(Date.now() / 2000 + i) * 2;
          // 正面
          ctx.fillStyle = `rgba(30, 41, 59, 0.9)`;
          ctx.fillRect(b.x + offset, portY - b.height, b.width, b.height);
          // 侧面（3D效果）
          ctx.fillStyle = `rgba(20, 30, 45, 0.9)`;
          ctx.beginPath();
          ctx.moveTo(b.x + b.width + offset, portY - b.height);
          ctx.lineTo(b.x + b.width + b.depth + offset, portY - b.height + b.depth * 0.3);
          ctx.lineTo(b.x + b.width + b.depth + offset, portY + b.depth * 0.3);
          ctx.lineTo(b.x + b.width + offset, portY);
          ctx.closePath();
          ctx.fill();
          // 窗户
          ctx.fillStyle = 'rgba(59, 160, 255, 0.6)';
          for (let floor = 0; floor < 5; floor++) {
            for (let win = 0; win < 3; win++) {
              const winX = b.x + 15 + win * 25 + offset;
              const winY = portY - b.height + 20 + floor * 25;
              ctx.fillRect(winX, winY, 15, 15);
            }
          }
        });
        
        // 集装箱（3D）
        for (let i = 0; i < 8; i++) {
          const containerX = canvas.width * 0.1 + i * 60;
          const containerY = horizon + 30;
          const containerZ = Math.sin(i) * 20;
          
          // 正面
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 215, 0, 0.8)' : 'rgba(59, 160, 255, 0.8)';
          ctx.fillRect(containerX, containerY, 50, 40);
          // 顶部
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 215, 0, 0.6)' : 'rgba(59, 160, 255, 0.6)';
          ctx.beginPath();
          ctx.moveTo(containerX, containerY);
          ctx.lineTo(containerX + containerZ, containerY - containerZ * 0.5);
          ctx.lineTo(containerX + 50 + containerZ, containerY - containerZ * 0.5);
          ctx.lineTo(containerX + 50, containerY);
          ctx.closePath();
          ctx.fill();
        }
        
        // 起重机
        const craneX = canvas.width * 0.7;
        const craneY = horizon - 100;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 4;
        // 主臂
        ctx.beginPath();
        ctx.moveTo(craneX, craneY);
        ctx.lineTo(craneX + 150, craneY - 80);
        ctx.stroke();
        // 吊钩
        ctx.beginPath();
        ctx.arc(craneX + 150, craneY - 80, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 215, 0, 1)';
        ctx.fill();
        
        ctx.restore();
      }
      
      drawHighway(offsetX: number = 0, opacity: number = 1) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(offsetX, 0);
        
        // 绘制高速公路场景
        const horizon = canvas.height * 0.5;
        
        // 天空渐变
        const skyGradient = ctx.createLinearGradient(0, 0, 0, horizon);
        skyGradient.addColorStop(0, 'rgba(13, 17, 23, 0.9)');
        skyGradient.addColorStop(1, 'rgba(30, 41, 59, 0.7)');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, horizon);
        
        // 道路（3D透视）
        const roadWidth = canvas.width * 0.6;
        const roadStartY = horizon;
        const roadEndY = canvas.height;
        const roadStartX = canvas.width * 0.2;
        const roadEndX = canvas.width * 0.5;
        
        // 道路主体
        ctx.fillStyle = 'rgba(40, 40, 40, 0.9)';
        ctx.beginPath();
        ctx.moveTo(roadStartX, roadStartY);
        ctx.lineTo(roadEndX, roadEndY);
        ctx.lineTo(roadEndX + roadWidth, roadEndY);
        ctx.lineTo(roadStartX + roadWidth, roadStartY);
        ctx.closePath();
        ctx.fill();
        
        // 道路标线（动态）
        const lineProgress = (Date.now() / 50) % 200;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 30]);
        ctx.beginPath();
        const centerStartX = roadStartX + roadWidth / 2;
        const centerEndX = roadEndX + roadWidth / 2;
        const centerStartY = roadStartY;
        const centerEndY = roadEndY;
        
        for (let i = 0; i < 10; i++) {
          const t = (i * 200 + lineProgress) / (canvas.height - horizon);
          if (t > 1) continue;
          const x = centerStartX + (centerEndX - centerStartX) * t;
          const y = centerStartY + (centerEndY - centerStartY) * t;
          ctx.moveTo(x - 2, y);
          ctx.lineTo(x + 2, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 路牌（3D）
        const signX = canvas.width * 0.6;
        const signY = horizon + 100;
        ctx.fillStyle = 'rgba(59, 160, 255, 0.9)';
        ctx.fillRect(signX, signY, 60, 40);
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('→', signX + 20, signY + 25);
        
        // 车辆（3D）
        const carX = canvas.width * 0.3 + Math.sin(Date.now() / 100) * 50;
        const carY = horizon + 150;
        // 车身
        ctx.fillStyle = 'rgba(59, 160, 255, 0.9)';
        ctx.fillRect(carX, carY, 80, 30);
        // 车窗
        ctx.fillStyle = 'rgba(13, 17, 23, 0.7)';
        ctx.fillRect(carX + 10, carY + 5, 60, 20);
        // 车轮
        ctx.fillStyle = 'rgba(20, 20, 20, 1)';
        ctx.beginPath();
        ctx.arc(carX + 20, carY + 30, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(carX + 60, carY + 30, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
      
      drawFactory(offsetX: number = 0, opacity: number = 1) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(offsetX, 0);
        
        // 绘制厂区场景
        const horizon = canvas.height * 0.55;
        
        // 地面
        ctx.fillStyle = 'rgba(30, 30, 30, 0.8)';
        ctx.fillRect(0, horizon, canvas.width, canvas.height - horizon);
        
        // 工厂建筑群（3D）
        const factories = [
          { x: canvas.width * 0.1, width: 120, height: 200, depth: 80, color: 'rgba(40, 50, 60, 0.9)' },
          { x: canvas.width * 0.35, width: 150, height: 250, depth: 100, color: 'rgba(50, 40, 30, 0.9)' },
          { x: canvas.width * 0.65, width: 130, height: 180, depth: 90, color: 'rgba(45, 45, 50, 0.9)' },
        ];
        
        factories.forEach((f, i) => {
          const offset = Math.sin(Date.now() / 3000 + i) * 3;
          // 正面
          ctx.fillStyle = f.color;
          ctx.fillRect(f.x + offset, horizon - f.height, f.width, f.height);
          // 侧面
          ctx.fillStyle = f.color.replace('0.9', '0.7');
          ctx.beginPath();
          ctx.moveTo(f.x + f.width + offset, horizon - f.height);
          ctx.lineTo(f.x + f.width + f.depth + offset, horizon - f.height + f.depth * 0.4);
          ctx.lineTo(f.x + f.width + f.depth + offset, horizon + f.depth * 0.4);
          ctx.lineTo(f.x + f.width + offset, horizon);
          ctx.closePath();
          ctx.fill();
          
          // 烟囱
          const chimneyX = f.x + f.width / 2 + offset;
          const chimneyY = horizon - f.height - 40;
          ctx.fillStyle = 'rgba(30, 30, 30, 0.9)';
          ctx.fillRect(chimneyX - 15, chimneyY, 30, 60);
          // 烟雾
          const smokeTime = Date.now() / 200;
          for (let s = 0; s < 5; s++) {
            const smokeX = chimneyX + Math.sin(smokeTime + s) * 20;
            const smokeY = chimneyY - s * 30 - Math.sin(smokeTime + s) * 10;
            const smokeSize = 20 + s * 10;
            const smokeAlpha = 0.3 - s * 0.05;
            ctx.fillStyle = `rgba(200, 200, 200, ${smokeAlpha})`;
            ctx.beginPath();
            ctx.arc(smokeX, smokeY, smokeSize, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // 窗户（发光）
          ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
          for (let floor = 0; floor < 6; floor++) {
            for (let win = 0; win < 4; win++) {
              const winX = f.x + 20 + win * 25 + offset;
              const winY = horizon - f.height + 30 + floor * 30;
              ctx.fillRect(winX, winY, 18, 20);
            }
          }
        });
        
        // 管道系统（3D）
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.8)';
        ctx.lineWidth = 8;
        for (let i = 0; i < 3; i++) {
          const pipeY = horizon - 50 - i * 30;
          ctx.beginPath();
          ctx.moveTo(canvas.width * 0.1, pipeY);
          ctx.lineTo(canvas.width * 0.9, pipeY);
          ctx.stroke();
        }
        
        ctx.restore();
      }
      
      drawMine(offsetX: number = 0, opacity: number = 1) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(offsetX, 0);
        
        // 绘制矿山场景
        const horizon = canvas.height * 0.6;
        
        // 山体（3D）
        const mountains = [
          { x: 0, width: canvas.width * 0.4, height: horizon * 0.8, color: 'rgba(40, 35, 30, 0.9)' },
          { x: canvas.width * 0.3, width: canvas.width * 0.5, height: horizon * 0.9, color: 'rgba(35, 30, 25, 0.9)' },
          { x: canvas.width * 0.6, width: canvas.width * 0.4, height: horizon * 0.7, color: 'rgba(45, 40, 35, 0.9)' },
        ];
        
        mountains.forEach((m) => {
          // 山体正面
          ctx.fillStyle = m.color;
          ctx.beginPath();
          ctx.moveTo(m.x, horizon);
          ctx.lineTo(m.x + m.width / 2, horizon - m.height);
          ctx.lineTo(m.x + m.width, horizon);
          ctx.closePath();
          ctx.fill();
          
          // 山体侧面（3D）
          ctx.fillStyle = m.color.replace('0.9', '0.7');
          ctx.beginPath();
          ctx.moveTo(m.x + m.width, horizon);
          ctx.lineTo(m.x + m.width + m.width * 0.3, horizon - m.height * 0.3);
          ctx.lineTo(m.x + m.width + m.width * 0.3, horizon);
          ctx.closePath();
          ctx.fill();
          
          // 矿山开采面
          const mineX = m.x + m.width * 0.3;
          const mineY = horizon - m.height * 0.5;
          ctx.fillStyle = 'rgba(60, 50, 40, 0.9)';
          ctx.fillRect(mineX, mineY, m.width * 0.4, m.height * 0.3);
          
          // 开采设备
          const equipmentX = mineX + m.width * 0.2;
          const equipmentY = mineY + m.height * 0.3;
          ctx.fillStyle = 'rgba(59, 160, 255, 0.8)';
          ctx.fillRect(equipmentX, equipmentY, 40, 30);
          // 挖掘臂
          ctx.strokeStyle = 'rgba(200, 200, 200, 0.9)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(equipmentX + 20, equipmentY);
          const armAngle = Math.sin(Date.now() / 500) * 0.5;
          ctx.lineTo(equipmentX + 20 + Math.cos(armAngle) * 50, equipmentY - Math.sin(armAngle) * 50);
          ctx.stroke();
        });
        
        // 运输道路
        const roadY = horizon + 50;
        ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
        ctx.fillRect(0, roadY, canvas.width, 40);
        // 道路标线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 20]);
        ctx.beginPath();
        ctx.moveTo(0, roadY + 20);
        ctx.lineTo(canvas.width, roadY + 20);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 运输车辆
        const truckX = (Date.now() / 10) % (canvas.width + 100) - 50;
        const truckY = roadY + 10;
        // 车头
        ctx.fillStyle = 'rgba(59, 160, 255, 0.9)';
        ctx.fillRect(truckX, truckY, 50, 25);
        // 车厢
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.fillRect(truckX + 50, truckY, 80, 25);
        // 车轮
        ctx.fillStyle = 'rgba(20, 20, 20, 1)';
        ctx.beginPath();
        ctx.arc(truckX + 15, truckY + 25, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(truckX + 35, truckY + 25, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(truckX + 90, truckY + 25, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(truckX + 110, truckY + 25, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    const scene3D = new Scene3D();

    // 创建粒子
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    // 创建道路轨迹
    const roads: RoadPath[] = [];
    for (let i = 0; i < 5; i++) {
      roads.push(new RoadPath(i % 2 === 0 ? 'rgba(59, 160, 255, 0.3)' : 'rgba(255, 215, 0, 0.2)'));
    }

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新过渡进度
      if (isTransitioningRef.current) {
        transitionProgressRef.current += 0.02; // 每帧增加2%，50帧完成（约2秒@60fps）
        cameraOffsetRef.current += canvas.width * 0.02; // 相机移动速度
        
        if (transitionProgressRef.current >= 1) {
          // 过渡完成
          transitionProgressRef.current = 1;
          sceneRef.current = nextSceneRef.current!;
          nextSceneRef.current = null;
          isTransitioningRef.current = false;
          cameraOffsetRef.current = 0;
        }
      }

      rotationRef.current += 0.002;
      const currentScene = sceneRef.current;
      const nextScene = nextSceneRef.current;
      
      // 计算过渡参数
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      if (isTransitioningRef.current && nextScene) {
        // 正在过渡：同时绘制两个场景
        const progress = easeInOutCubic(transitionProgressRef.current);
        
        // 当前场景：向左滑出，逐渐淡出
        const currentOffsetX = -progress * canvas.width;
        const currentOpacity = 1 - progress;
        
        // 新场景：从右侧滑入，逐渐淡入
        const nextOffsetX = (1 - progress) * canvas.width;
        const nextOpacity = progress;
        
        // 绘制当前场景
        switch (currentScene) {
          case 'port':
            scene3D.drawPort(currentOffsetX, currentOpacity);
            break;
          case 'highway':
            scene3D.drawHighway(currentOffsetX, currentOpacity);
            break;
          case 'factory':
            scene3D.drawFactory(currentOffsetX, currentOpacity);
            break;
          case 'mine':
            scene3D.drawMine(currentOffsetX, currentOpacity);
            break;
        }
        
        // 绘制新场景
        switch (nextScene) {
          case 'port':
            scene3D.drawPort(nextOffsetX, nextOpacity);
            break;
          case 'highway':
            scene3D.drawHighway(nextOffsetX, nextOpacity);
            break;
          case 'factory':
            scene3D.drawFactory(nextOffsetX, nextOpacity);
            break;
          case 'mine':
            scene3D.drawMine(nextOffsetX, nextOpacity);
            break;
        }
      } else {
        // 正常显示：只绘制当前场景
        switch (currentScene) {
          case 'port':
            scene3D.drawPort(0, 1);
            break;
          case 'highway':
            scene3D.drawHighway(0, 1);
            break;
          case 'factory':
            scene3D.drawFactory(0, 1);
            break;
          case 'mine':
            scene3D.drawMine(0, 1);
            break;
        }
      }

      // 绘制粒子（在场景之上，增强科技感）
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // 绘制道路轨迹
      roads.forEach((road) => {
        road.update();
        road.draw();
      });

      // 连接附近的粒子 - 增强效果
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            const opacity = 0.3 * (1 - distance / 200);
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(59, 160, 255, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 215, 0, ${opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(59, 160, 255, ${opacity})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="login-background">
      <div className="background-gradient" />
      <div className="grid-overlay" />
      <canvas ref={canvasRef} className="particles-canvas" />
      <div className="glow-effect" />
    </div>
  );
};

export default LoginBackground;

