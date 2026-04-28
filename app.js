async function loadPage(pageName, title, btn) {
    const container = document.getElementById('app-content');
    
    try {
        // 1. 抓取子頁面內容
        const response = await fetch(`./pages/${pageName}.html`);
        const html = await response.text();
        
        // 2. 注入內容
        container.innerHTML = html;
        
        // 3. 更新 UI 狀態
        document.getElementById('headerTitle').innerText = title;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        btn.classList.add('active');

        // 4. 震動回饋
        if (navigator.vibrate) navigator.vibrate(5);
        
    } catch (error) {
        console.error('頁面載入失敗:', error);
        container.innerHTML = '<p style="padding:20px;">載入失敗，請檢查路徑。</p>';
    }
}

// 初始載入首頁
window.onload = () => {
    const firstTab = document.querySelector('.nav-item');
    loadPage('live', '即時行蹤', firstTab);
};