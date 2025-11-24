import { useEffect, useRef } from 'react';
import './LoginBackground.less';

const LoginBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      constructor() {
        this.points = [];
        this.progress = Math.random() * 100;
        this.speed = Math.random() * 0.3 + 0.1;
        this.generatePath();
      }

      generatePath() {
        const startY = Math.random() * canvas.height;
        const numPoints = 20;
        for (let i = 0; i < numPoints; i++) {
          this.points.push({
            x: (canvas.width / numPoints) * i,
            y: startY + Math.sin(i * 0.5) * 50 + (Math.random() - 0.5) * 30,
          });
        }
      }

      update() {
        this.progress += this.speed;
        if (this.progress > 100) {
          this.progress = 0;
          this.generatePath();
        }
      }

      draw() {
        if (!ctx || this.points.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 160, 255, 0.3)`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -this.progress * 2;

        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 创建粒子
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    // 创建道路轨迹
    const roads: RoadPath[] = [];
    for (let i = 0; i < 5; i++) {
      roads.push(new RoadPath());
    }

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制粒子
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

