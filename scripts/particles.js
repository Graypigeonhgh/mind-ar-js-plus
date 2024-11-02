class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particlesArray = [];
        this.numberOfParticles = 100;
        
        // 设置canvas样式
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        // 将canvas添加到body
        document.body.prepend(this.canvas);
        
        // 初始化
        this.init();
        window.addEventListener('resize', () => this.init());
    }

    init() {
        // 设置canvas尺寸
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 创建粒子
        this.particlesArray = [];
        for(let i = 0; i < this.numberOfParticles; i++) {
            this.particlesArray.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // 开始动画
        this.animate();
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for(let i = 0; i < this.particlesArray.length; i++) {
            let p = this.particlesArray[i];
            
            // 更新位置
            p.x += p.speedX;
            p.y += p.speedY;
            
            // 边界检查
            if(p.x > this.canvas.width) p.x = 0;
            if(p.x < 0) p.x = this.canvas.width;
            if(p.y > this.canvas.height) p.y = 0;
            if(p.y < 0) p.y = this.canvas.height;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            this.ctx.fill();
            
            // 连接临近粒子
            for(let j = i + 1; j < this.particlesArray.length; j++) {
                let p2 = this.particlesArray[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance/100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// 导出类
export { ParticleBackground }; 