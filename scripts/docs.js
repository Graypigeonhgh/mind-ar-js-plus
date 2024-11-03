document.addEventListener('DOMContentLoaded', () => {
    // 处理侧边栏导航
    const sidebarLinks = document.querySelectorAll('.docs-sidebar a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 移除所有active类
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // 添加active类到当前点击的链接
            link.classList.add('active');
        });
    });

    // 处理代码块
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // 如果使用了代码高亮库，这里可以调用相应的初始化函数
        // 例如：hljs.highlightBlock(block);
    });

    // 添加侧边栏宽度调节功能
    const sidebar = document.querySelector('.docs-sidebar');
    const resizer = document.querySelector('.sidebar-resizer');
    const container = document.querySelector('.docs-container');

    let isResizing = false;
    let startX;
    let startWidth;

    resizer.addEventListener('mousedown', initResize);

    function initResize(e) {
        isResizing = true;
        startX = e.clientX;
        startWidth = parseInt(window.getComputedStyle(sidebar).width, 10);

        // 添加事件监听器
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);

        // 添加调整时的样式
        container.classList.add('resizing');
        resizer.classList.add('resizing');
    }

    function resize(e) {
        if (!isResizing) return;

        const width = startWidth + (e.clientX - startX);
        
        // 限制最小和最大宽度
        if (width > 150 && width < 600) {
            sidebar.style.width = `${width}px`;
        }
    }

    function stopResize() {
        isResizing = false;
        
        // 移除事件监听器
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);

        // 移除调整时的样式
        container.classList.remove('resizing');
        resizer.classList.remove('resizing');
    }

    // 处理移动端
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // 窗口大小改变时重置侧边栏宽度
    window.addEventListener('resize', () => {
        if (isMobile()) {
            sidebar.style.width = '100%';
        } else {
            sidebar.style.width = '280px'; // 默认宽度
        }
    });
}); 