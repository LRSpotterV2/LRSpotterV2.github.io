// --- Firebase 模組導入 ---
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('app-content');
    const headerTitle = document.getElementById('headerTitle');
    const navItems = document.querySelectorAll('.nav-item');

    // --- Firebase Auth 初始化 ---
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    // 全域變數掛載，確保其他邏輯可存取
    window.user = null;
    window.favorites = new Set();

    // 登入功能
    window.login = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("登入失敗:", error);
        }
    };

    // 登出功能
    window.logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("登出失敗:", error);
        }
    };

    // 狀態監聽
onAuthStateChanged(auth, (user) => {
    window.user = user;
    const profileBtn = document.getElementById('userProfileBtn');
    
    if (user) {
        // 登入後：顯示頭像
        if (profileBtn) {
            profileBtn.innerHTML = `<img src="${user.photoURL}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        }

        // 同步收藏名單 (保持你原本的邏輯)
const favRef = window.ref(window.db, `users/${user.uid}/favs`); // 確保路徑對應
window.onValue(favRef, (snapshot) => {
    const data = snapshot.val() || [];
    // 判斷 data 是 Array 還是 Object (Firebase 有時會將連續數字 Key 轉為 Array)
    const favArray = Array.isArray(data) ? data : Object.values(data);
    window.favorites = new Set(favArray.map(String));
    refreshLiveUI();
});
    } else {
        // 登出後：恢復預設 Material Icon
        if (profileBtn) {
            profileBtn.innerHTML = `<span class="material-symbols-rounded">person</span>`;
        }
        window.favorites = new Set();
        refreshLiveUI();
    }
});

    // 輔助：手動刷新 Live 頁面邏輯
    function refreshLiveUI() {
        if (typeof window.applyFiltersAndSearch === 'function') {
            window.applyFiltersAndSearch();
        }
    }

    // --- 靜態數據定義 ---
    const routeCfg = { "505": ["三聖", "兆康"], "506P": ["兆康"], "507": ["田景", "屯門碼頭"], "507P": ["屯門碼頭"], "610": ["元朗", "屯門碼頭"], "614": ["元朗", "屯門碼頭"], "614P": ["兆康", "屯門碼頭"], "615": ["元朗", "屯門碼頭"], "615P": ["兆康", "屯門碼頭"], "705": ["天水圍循環綫", "以天水圍為終點站"], "706": ["天水圍循環綫", "以天水圍為終點站"], "720": ["天榮"], "751": ["友愛", "天逸"], "751P": ["天水圍", "天逸"], "751L": ["屯門碼頭"], "761P": ["元朗", "天逸"], "不載客": ["三聖", "屯門碼頭", "田景", "兆康", "元朗", "友愛", "天逸", "天榮", "天水圍",  "屯門車廠", "洪天路", "---"], "司機訓練": ["三聖", "屯門碼頭", "田景", "兆康", "元朗", "友愛", "天逸", "天榮", "天水圍",  "屯門車廠", "洪天路", "---"], "回廠": ["---"], "專用": ["三聖", "屯門碼頭", "田景", "兆康", "元朗", "友愛", "天逸", "天榮", "天水圍", "屯門車廠", "洪天路", "---"], "屯門專綫": ["屯門"], "元朗專綫": ["天逸"] };
    const colorMap = { "505":"#D92329", "506P":"#000000", "507":"#00A551", "507P":"#00A551", "610":"#541B15", "614":"#00C0F3", "614P":"#F2858E", "615":"#FFDD00", "615P":"#006585", "705":"#6EBF45", "706":"#B17AB5", "720":"#000000", "751":"#F48221", "751L":"#F48221", "751P":"#000000", "761P":"#6E2C91", "不載客":"#000000", "司機訓練":"#000000", "回廠":"#000000", "專用":"#000000", "屯門專綫": "#E67237", "元朗專綫": "#56B847"};

    // --- 導航邏輯 ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            const title = item.getAttribute('data-title');
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            navigateTo(pageId, title);
            if (navigator.vibrate) navigator.vibrate(5);
        });
    });

    async function navigateTo(pageId, title) {
        contentArea.classList.add('page-exit');
        headerTitle.innerText = title;
        await new Promise(resolve => setTimeout(resolve, 250));

        try {
            const response = await fetch(`pages/${pageId}.html`);
            if (!response.ok) throw new Error('Page not found');
            const html = await response.text();

            contentArea.classList.remove('page-exit');
            contentArea.classList.add('page-enter');
            contentArea.innerHTML = html;
            window.scrollTo(0, 0);

            if (pageId === 'live') {
                initLivePageLogic();
            }

            setTimeout(() => {
                contentArea.classList.remove('page-enter');
            }, 10);
        } catch (error) {
            contentArea.innerHTML = `<div class="spotting-card">無法載入內容: ${pageId}</div>`;
            contentArea.classList.remove('page-exit');
        }
    }

// --- Firebase 數據監聽與搜尋邏輯 ---
    function initLivePageLogic() {
        const liveList = document.getElementById('liveList');
        const searchInput = document.getElementById('searchComp');
        const chips = document.querySelectorAll('.chip');
        if (!liveList) return;

        if (!window.db || !window.ref || !window.onValue) {
            setTimeout(initLivePageLogic, 200);
            return;
        }

        // 定義內部變數
        let allReports = [];
        let specialTrainsConfig = {};
        let runOccupancyData = new Map();
        let currentTab = 'all'; 

		let sortMode = 'time'; // 'time' 或 'route'
		const sortToggleBtn = document.getElementById('sortToggleBtn');
		const sortLabel = document.getElementById('sortLabel');

const sortReports = (dataArray) => {
    if (sortMode === 'time') {
        return [...dataArray].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } else {
        return [...dataArray].sort((a, b) => {
            // 先按路綫排序 (轉為數字比對，非數字如"司機訓練"排最後)
            const routeA = parseInt(a.rteKey) || 999;
            const routeB = parseInt(b.rteKey) || 999;
            if (routeA !== routeB) return routeA - routeB;
            // 同路綫則按車序排序
            return (parseInt(a.rno) || 0) - (parseInt(b.rno) || 0);
        });
    }
};

        const spottingRef = window.ref(window.db, 'live_reports');
        const configRef = window.ref(window.db, 'config/special_trains');

        // 核心：統一 ID 格式化工具 (解決 車務調動 誤報)
        const normalizeId = (id) => String(id || '').replace(/[\+\-–\s]+/g, '+').trim().toUpperCase();

        function getOperationDayStart() {
            const now = new Date();
            const start = new Date(now);
            if (now.getHours() < 5) start.setDate(now.getDate() - 1);
            start.setHours(5, 0, 0, 0);
            return start.getTime();
        }

        // --- 過濾與渲染核心 ---
        window.applyFiltersAndSearch = function() {
            const term = searchInput ? searchInput.value.trim().toLowerCase() : "";
            
            if (currentTab === 'fav') {
                if (!window.user) {
                    liveList.innerHTML = `
                        <div style="text-align:center; padding:60px 20px;">
                            <p style="color:var(--md-sys-color-outline); margin-bottom: 20px;">請先登入以查看監察列表</p>
                            <button onclick="window.login()" style="background:var(--md-sys-color-primary); color:white; border:none; padding:10px 24px; border-radius:100px; font-weight:600;">Google 登入</button>
                        </div>`;
                    return;
                }

                const favIds = Array.from(window.favorites || []);
                if (favIds.length === 0) {
                    liveList.innerHTML = "<p style='text-align:center; padding:40px; color:var(--md-sys-color-outline);'>目前沒有監察編組</p>";
                    return;
                }

                liveList.innerHTML = favIds.map(fid => {
                    const normFid = normalizeId(fid);
                    // 搜尋比對
                    if (term && !normFid.toLowerCase().includes(term)) return '';

                    // 從即時數據中尋找對應編組
                    const existingReport = allReports.find(r => normalizeId(r.fullId) === normFid);

                    if (existingReport) {
                        const desc = getSpecialDesc(existingReport.fullId, specialTrainsConfig);
                        let isOutdated = false;
                        if (runOccupancyData.has(existingReport.rno)) {
                            const owner = runOccupancyData.get(existingReport.rno);
                            // 使用正規化比對，避免因符號不同觸發「車務調動」
                            if (owner && normalizeId(owner.fullId) !== normalizeId(existingReport.fullId)) {
                                isOutdated = true;
                            }
                        }
                        return `<div class="fav-item-container" data-fid="${fid}">${createTrainCard(existingReport, desc, isOutdated).innerHTML}</div>`;
                    } else {
                        // 今日暫無紀錄：顯示 Logo 與灰化樣式
                        const isDouble = /[\+\-–]/.test(String(fid));
                        return `
                            <div class="fav-item-container" data-fid="${fid}" style="opacity: 0.5;">
                                <div class="spotting-card" style="border-left-color: #ccc; padding: 10px 12px; border-radius: 12px; margin-bottom: 8px; display: flex; flex-direction: column;">
                                    <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
                                        <div class="train-icon-container" style="display: flex; align-items: center; flex: 0 0 56px; height: 32px; justify-content: flex-start;">
                                            <img src="LRVP1_Retro.png" style="height: 26px; width: 28px; object-fit: contain;">
                                            ${isDouble ? `<img src="LRVP1_Retro.png" style="height: 26px; width: 28px; object-fit: contain;">` : ''}
                                        </div>
                                        <div style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
                                            <div style="font-size: 17px; font-weight: 800; color: var(--md-sys-color-on-surface); letter-spacing: -0.5px; line-height: 1.2;">${fid}</div>
                                            <div style="font-size: 11px; color: var(--md-sys-color-outline);">今日暫無紀錄</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                    }
                }).join('');
} else {
    const filtered = allReports.filter(item => {
        if (!term) return true;
        return (item.fullId && item.fullId.toLowerCase().includes(term)) ||
               (item.rteKey && item.rteKey.toLowerCase().includes(term)) ||
               (item.loc && item.loc.toLowerCase().includes(term));
    });

    // 關鍵：渲染前先執行排序
    const sortedData = sortReports(filtered);
    renderList(sortedData, runOccupancyData);
}
        };

if (sortToggleBtn) {
    sortToggleBtn.addEventListener('click', () => {
        sortMode = (sortMode === 'time') ? 'route' : 'time';
        
        // 更新 UI 標籤
        if (sortLabel) {
            sortLabel.innerText = sortMode === 'time' ? '排序：按時間 (新→舊)' : '排序：按路綫 (505→761P)';
        }

        // 震動回饋 (選填)
        if (navigator.vibrate) navigator.vibrate(5);

        // 重新執行過濾與渲染
        window.applyFiltersAndSearch();
    });
}


        // 綁定 Chips 點擊
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.style.background = 'var(--md-sys-color-surface-variant)');
                chip.style.background = 'var(--md-sys-color-secondary-container)';
                currentTab = (chip.innerText.trim() === '我的最愛') ? 'fav' : 'all';
                window.applyFiltersAndSearch();
            });
        });

        // 監聽數據
        window.onValue(configRef, (configSnap) => {
            specialTrainsConfig = configSnap.val() || {};
            window.onValue(spottingRef, (snapshot) => {
                const data = snapshot.val();
                if (!data) {
                    liveList.innerHTML = '<div style="text-align:center; padding:40px; color:gray;">目前沒有行蹤紀錄</div>';
                    return;
                }

                const operationStartTs = getOperationDayStart();
                const latestMap = new Map();
                const runOccupancy = new Map();

                Object.keys(data).forEach(carId => {
                    const traces = data[carId].traces || [];
                    if (Array.isArray(traces)) {
                        traces.filter(t => (t.timestamp || 0) >= operationStartTs).forEach(trace => {
                            const normalizedKey = normalizeId(trace.fullId || carId);
                            if (!latestMap.has(normalizedKey) || trace.timestamp > latestMap.get(normalizedKey).timestamp) {
                                latestMap.set(normalizedKey, trace);
                            }
                            if (trace.rno && (!runOccupancy.has(trace.rno) || trace.timestamp > runOccupancy.get(trace.rno).timestamp)) {
                                runOccupancy.set(trace.rno, { fullId: normalizedKey, timestamp: trace.timestamp });
                            }
                        });
                    }
                });

                allReports = Array.from(latestMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                runOccupancyData = runOccupancy;
                window.applyFiltersAndSearch();
            });
        });

        if (searchInput) searchInput.oninput = window.applyFiltersAndSearch;

        function renderList(dataArray, runOccupancy = null) {
            liveList.innerHTML = '';
            if (!dataArray || dataArray.length === 0) {
                liveList.innerHTML = '<div style="text-align:center; padding:40px; color:gray;">今日營運時段暫無紀錄</div>';
                return;
            }
            dataArray.forEach(item => {
                const desc = getSpecialDesc(item.fullId, specialTrainsConfig);
                let isOutdated = false;
                if (runOccupancy && item.rno) {
                    const owner = runOccupancy.get(item.rno);
                    // 這裡也要使用正規化比對
                    if (owner && normalizeId(owner.fullId) !== normalizeId(item.fullId)) isOutdated = true;
                }
                liveList.appendChild(createTrainCard(item, desc, isOutdated));
            });
        }
    }

    // --- 輔助函數 ---
    function getSpecialDesc(fullId, config) {
        if (!fullId || !config) return "";
        const now = new Date();
        const operDate = new Date(now);
        if (now.getHours() < 5) operDate.setDate(now.getDate() - 1);
        const currentOperTime = new Date(operDate.getFullYear(), operDate.getMonth(), operDate.getDate()).getTime();
        const carNums = fullId.split(/[\+\-–]/);
        for (let key in config) {
            const theme = config[key];
            if (theme.cars && carNums.some(n => theme.cars.includes(n.trim()))) {
                if (theme.EndDate && currentOperTime > new Date(theme.EndDate).getTime()) continue;
                return theme.shortdesc || "";
            }
        }
        return ""; 
    }

    function createTrainCard(data, specialDesc, isOutdated = false) {
        const div = document.createElement('div');
        const routeColor = colorMap[data.rteKey] || '#6750A4';
        const isDouble = /[\+\-–]/.test(data.fullId || '');
        const displayFullId = data.fullId || '----';
        const statusTextHtml = isOutdated ? `<div style="font-size: 9px; color: var(--md-sys-color-outline); font-weight: 500; margin-bottom: -2px; letter-spacing: 0.5px;">車務調動</div>` : '';
        const opacityStyle = isOutdated ? 'opacity: 0.5;' : '';

        let destination = "---";
        if (data.dRte && data.dRte.includes('往')) {
            destination = data.dRte.split('往')[1].trim();
        } else if (routeCfg[data.rteKey]) {
            destination = routeCfg[data.rteKey].join(' / ');
        }

        const infoWidth = "84px";
        const specialDescHtml = specialDesc ? `<div style="font-size: 10px; color: var(--md-sys-color-outline); width: ${infoWidth}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; letter-spacing: -0.5px;">${specialDesc}</div>` : '';
        const memHtml = data.mem ? `<div style="font-size: 10px; color: var(--md-sys-color-primary); opacity: 0.9; max-width: 100%; line-height: 1.2; margin-top: 2px; letter-spacing: -0.2px; word-wrap: break-word;">${data.mem}</div>` : '';

        div.innerHTML = `
            <div class="spotting-card" style="border-left-color: ${routeColor}; padding: 10px 12px; border-radius: 12px; margin-bottom: 8px; display: flex; flex-direction: column; ${opacityStyle}">
                <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
                    <div class="train-icon-container" style="display: flex; align-items: center; flex: 0 0 56px; height: 32px; justify-content: flex-start;">
                        <img src="LRVP1_Retro.png" style="height: 26px; width: 28px; object-fit: contain;">
                        ${isDouble ? `<img src="LRVP1_Retro.png" style="height: 26px; width: 28px; object-fit: contain;">` : ''}
                    </div>
                    <div style="display: flex; flex-direction: column; flex: 0 0 ${infoWidth}; min-width: ${infoWidth}; overflow: hidden;">
                        ${statusTextHtml}
                        <div style="font-size: 17px; font-weight: 800; color: var(--md-sys-color-on-surface); letter-spacing: -0.5px; line-height: 1.2; width: ${infoWidth}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${displayFullId}
                        </div>
                        ${specialDescHtml}
                        <div class="mem-container-inner">${memHtml}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; border-left: 1px solid var(--md-sys-color-outline-variant, #eee); padding-left: 8px; flex: 1; min-width: 0;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0;">
                            <span class="route-badge" style="background: ${routeColor}; color: #FFFFFF; width: 36px; padding: 1px 0; border: 1px solid ${routeColor}; border-radius: 4px; font-size: 11px; text-align: center; font-weight: 700; box-sizing: border-box;">
                                ${data.rteKey || '---'}
                            </span>
                            <span style="background: transparent; border: 1px solid var(--md-sys-color-outline); color: var(--md-sys-color-on-surface-variant); width: 36px; padding: 1px 0; border-radius: 4px; font-size: 10px; text-align: center; box-sizing: border-box;">
                                ${data.rno || '---'}
                            </span>
                        </div>
                        <div style="display: flex; flex-direction: column; min-width: 0;">
                            <div style="font-size: 14px; color: var(--md-sys-color-on-surface); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${destination}
                            </div>
                            <div style="font-size: 11px; color: var(--md-sys-color-on-surface-variant); opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${data.loc || '未知位置'}
                            </div>
                        </div>
                    </div>
                    <div style="text-align: right; flex-shrink: 0; margin-left: auto;">
                        <div style="font-size: 11px; color: var(--md-sys-color-outline); font-family: 'Roboto Mono', monospace; font-weight: 500;">
                            ${data.tStr || '--:--'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        return div;
    }

    navigateTo('live', 'LRSpotter');
});