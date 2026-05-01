// --- Firebase 模組導入 ---
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, get, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('app-content');
    const headerTitle = document.getElementById('headerTitle');
    const navItems = document.querySelectorAll('.nav-item');

    // --- Firebase Auth 初始化 ---
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

window.db = getDatabase();
    window.ref = ref;
    window.onValue = onValue;
    window.get = get; // 修正關鍵：讓 viewTrainHistory 能找到 get
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

            // 同步收藏名單
            const favRef = window.ref(window.db, `users/${user.uid}/favs`);
            window.onValue(favRef, (snapshot) => {
                const data = snapshot.val() || [];
                const favArray = Array.isArray(data) ? data : Object.values(data);
                window.favorites = new Set(favArray.map(String));
                refreshLiveUI();
            });
        } else {
            // 登出後：恢復預設
            if (profileBtn) {
                profileBtn.innerHTML = `<span class="material-symbols-rounded">person</span>`;
            }
            window.favorites = new Set();
            refreshLiveUI();
        }
    });

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
    // 切換前：如果現在在 ETA 頁面，先把站點 ID 存起來
    const currentInput = document.getElementById('station_id_input');
    if (currentInput) {
        window.lastSelectedStation = currentInput.value;
    }

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
} else if (pageId === 'eta') {
    initETAPageLogic(); // 觸發 ETA 邏輯
}

            setTimeout(() => {
                contentArea.classList.remove('page-enter');
            }, 10);
        } catch (error) {
            contentArea.innerHTML = `<div class="spotting-card">無法載入內容: ${pageId}</div>`;
            contentArea.classList.remove('page-exit');
        }
    }
	window.navigateTo = navigateTo;

    window.getCarIcon = function(carNum, specialConfig) {
        const numStr = String(carNum).trim();
        const num = parseInt(numStr);
        if (specialConfig) {
            for (let key in specialConfig) {
                const theme = specialConfig[key];
                if (theme.cars && theme.cars.includes(numStr)) {
                    if (theme.logo) return `${theme.logo}.png`;
                }
            }
        }
        if (!isNaN(num)) {
            if (num >= 1001 && num <= 1026 | num >= 1028 && num <= 1070) return "P1R.png";
            if (num >= 1071 && num <= 1090) return "P2.png";
            if (num >= 1201 && num <= 1210) return "P2.png";
            if (num >= 1091 && num <= 1110) return "P3.png";
            if (num >= 1111 && num <= 1132) return "P4.png";
            if (num >= 1133 && num <= 1162) return "P5.png";
            if (num >= 1211 && num <= 1220) return "P5T.png";
        }
        return "P1R.png";
    }

    function initLivePageLogic() {
        const liveList = document.getElementById('liveList');
        const searchInput = document.getElementById('searchComp');
        const chips = document.querySelectorAll('.chip');
        const sortToggleBtn = document.getElementById('sortToggleBtn');
        const sortLabel = document.getElementById('sortLabel');
        if (!liveList) return;
		
		let unsubscribeSpotting = null; // 在 initLivePageLogic 內部最上方

        liveList.innerHTML = `
            <div id="sync-loader" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 0; gap: 16px;">
                <div class="m3-progress-linear"><div class="m3-progress-bar"></div></div>
                <span style="font-size: 14px; color: var(--md-sys-color-primary); font-weight: 500; letter-spacing: 0.5px; animation: pulse 1.5s infinite;">正在同步數據...</span>
            </div>
        `;

        if (!window.db || !window.ref || !window.onValue) {
            setTimeout(initLivePageLogic, 200);
            return;
        }


// --- 修改後的變數初始化區域 ---
let allReports = [];
let specialTrainsConfig = {};
let runOccupancyData = new Map();
let currentTab = 'all'; 
let isInitialLoadComplete = false;

// 關鍵修改：將變數掛載到 window，讓全域函數 (如 viewPhaseDetails) 可以讀取
window.allReports = allReports; 
window.specialTrainsConfig = specialTrainsConfig;
window.runOccupancyData = runOccupancyData;
window.colorMap = colorMap; // 確保顏色對照表也在全域

let sortMode = 'time'; 
let isAscending = false;

        const normalizeId = (id) => String(id || '').replace(/[\+\-–\s]+/g, '+').trim().toUpperCase();

        function getOperationDayStart() {
            const now = new Date();
            const start = new Date(now);
            if (now.getHours() < 5) start.setDate(now.getDate() - 1);
            start.setHours(5, 0, 0, 0);
            return start.getTime();
        }

const sortReports = (dataArray) => {
    return [...dataArray].sort((a, b) => {
        let comparison = 0;
        
        if (sortMode === 'time') {
            comparison = (a.timestamp || 0) - (b.timestamp || 0);
        } else if (sortMode === 'route') {
            const routeA = parseInt(a.rteKey) || 999;
            const routeB = parseInt(b.rteKey) || 999;
            if (routeA !== routeB) {
                comparison = routeA - routeB;
            } else {
                comparison = (parseInt(a.rno) || 0) - (parseInt(b.rno) || 0);
            }
        } else if (sortMode === 'startDate') {
            const cfgA = getSpecialConfig(a.fullId, specialTrainsConfig);
            const cfgB = getSpecialConfig(b.fullId, specialTrainsConfig);
            const dateA = cfgA?.StartDate ? new Date(cfgA.StartDate).getTime() : 0;
            const dateB = cfgB?.StartDate ? new Date(cfgB.StartDate).getTime() : 0;
            comparison = dateA - dateB;
        }

        // 如果是升序 (isAscending = true)，保持 comparison
        // 如果是降序 (isAscending = false)，取反 (原本邏輯是新到舊，即 b-a)
        return isAscending ? comparison : -comparison;
    });
};

// 輔助函數：更新 UI 文字
// 修正輔助函數名稱
const updateSortUI = () => {
    const btnSortText = document.getElementById('btnSortText');
    const sortOrderIcon = document.getElementById('sortOrderIcon');
    
    // 必須包含 startDate 鍵值
    const labels = { 
        'time': '報告時間', 
        'route': '路綫車序', 
        'startDate': '上廣日期' 
    };
    
    if (btnSortText) {
        const currentLabel = labels[sortMode] || '排序';
        btnSortText.innerText = currentLabel;
    }

    if (sortOrderIcon) {
        sortOrderIcon.innerText = isAscending ? 'north' : 'south';
    }
};

// 輔助函數：獲取完整的特別車輛配置
function getSpecialConfig(fullId, config) {
    if (!fullId || !config) return null;
    const carNums = String(fullId).split(/[\+\-–]/).map(n => n.trim());
    for (let key in config) {
        const theme = config[key];
        if (theme.cars && carNums.some(n => theme.cars.includes(n))) {
            return theme;
        }
    }
    return null;
        };

window.applyFiltersAndSearch = function() {
    const term = searchInput ? searchInput.value.trim().toLowerCase() : "";
    
    if (currentTab === 'fav') {
        // 1. 檢查登入狀態
        if (!window.user) {
            liveList.innerHTML = `<div style="text-align:center; padding:60px 20px;"><p style="color:var(--md-sys-color-outline); margin-bottom: 20px;">請先登入以查看監察列表</p><button onclick="window.login()" style="background:var(--md-sys-color-primary); color:white; border:none; padding:10px 24px; border-radius:100px; font-weight:600;">Google 登入</button></div>`;
            return;
        }

        // 2. 獲取收藏列表
        const favIds = Array.from(window.favorites || []);
        if (favIds.length === 0) {
            liveList.innerHTML = "<p style='text-align:center; padding:40px; color:var(--md-sys-color-outline);'>目前沒有監察編組</p>";
            return;
        }

        // 3. 過濾出符合收藏 ID 的報告
        const favReports = allReports.filter(item => {
            const normFid = normalizeId(item.fullId);
            const isMatchFav = favIds.some(fid => normalizeId(fid) === normFid);
            const matchesTerm = !term || normFid.toLowerCase().includes(term);
            return isMatchFav && matchesTerm;
        });

        // --- 修正位置：加上 sortReports 確保排序生效 ---
        renderList(sortReports(favReports), runOccupancyData);
    } 
    // ... 其餘邏輯保持不變
    else if (currentTab === 'special') {
        const specialReports = allReports.filter(item => {
            const desc = getSpecialDesc(item.fullId, specialTrainsConfig);
            const matchesTerm = !term || 
                               (item.fullId && item.fullId.toLowerCase().includes(term)) ||
                               (item.rteKey && item.rteKey.toLowerCase().includes(term));
            return desc !== "" && matchesTerm; 
        });

        if (specialReports.length === 0) {
            liveList.innerHTML = "<p style='text-align:center; padding:40px; color:var(--md-sys-color-outline);'>目前沒有特殊塗裝車輛在線上</p>";
        } else {
            renderList(sortReports(specialReports), runOccupancyData);
        }
    } 
    else {
        const filtered = allReports.filter(item => {
            if (!term) return true;
            return (item.fullId && item.fullId.toLowerCase().includes(term)) ||
                   (item.rteKey && item.rteKey.toLowerCase().includes(term)) ||
                   (item.loc && item.loc.toLowerCase().includes(term));
        });
        renderList(sortReports(filtered), runOccupancyData);
    }
};


// --- 在 initLivePageLogic 內定義，建議放在 applyFiltersAndSearch 之後 ---

function fetchData(dateStr = "") {
            // 停止之前的監聽，避免重複
            if (unsubscribeSpotting) {
                unsubscribeSpotting();
                unsubscribeSpotting = null;
            }
            
            liveList.innerHTML = `<div id="sync-loader" style="display:flex; flex-direction:column; align-items:center; padding:40px 0; gap:16px;"><div class="m3-progress-linear"><div class="m3-progress-bar"></div></div><span style="font-size:14px; color:var(--md-sys-color-primary);">正在檢索數據庫...</span></div>`;

            // 計算目標日期的營運時間邊界 (05:00 - 次日 04:59)
            // 這裡直接使用輔助函數處理時間戳
            let d;
            if (dateStr) {
                d = new Date(dateStr);
            } else {
                d = new Date();
                if (d.getHours() < 5) d.setDate(d.getDate() - 1);
            }
            d.setHours(5, 0, 0, 0);
            const startBound = d.getTime();
            const endBound = startBound + (24 * 60 * 60 * 1000) - 1;

            // 始終監聽 live_reports 路徑
            unsubscribeSpotting = window.onValue(window.ref(window.db, 'live_reports'), (snapshot) => {
                isInitialLoadComplete = true;
                const data = snapshot.val();
                if (!data) { 
                    allReports = []; 
                    runOccupancyData = new Map();
                    renderList([]); 
                    return; 
                }

                const latestMap = new Map();
                runOccupancyData = new Map();

                Object.keys(data).forEach(carId => {
                    const traces = data[carId].traces || [];
                    if (Array.isArray(traces)) {
                        traces.forEach(t => {
                            // 根據 timestamp 篩選該日期的紀錄
                            if (t.timestamp >= startBound && t.timestamp <= endBound) {
                                const nid = normalizeId(t.fullId || carId);
                                
                                if (!latestMap.has(nid) || t.timestamp > latestMap.get(nid).timestamp) {
                                    latestMap.set(nid, t);
                                }
                                
                                if (t.rno) {
                                    if (!runOccupancyData.has(t.rno) || t.timestamp > runOccupancyData.get(t.rno).timestamp) {
                                        runOccupancyData.set(t.rno, { 
                                            fullId: nid, 
                                            timestamp: t.timestamp 
                                        });
                                    }
                                }
                            }
                        });
                    }
                });

                allReports = Array.from(latestMap.values());
    window.allReports = allReports; 
    window.specialTrainsConfig = specialTrainsConfig; 
    window.applyFiltersAndSearch();
});
        }


// --- 在事件處理區域加入 ---

const dateInput = document.getElementById('hiddenDatePicker');
if (dateInput) {
    dateInput.onchange = (e) => {
        const val = e.target.value; // 獲取選取的 YYYY-MM-DD
        if (val) {
            // 1. 核心邏輯：更改日期後，自動切換回「所有路綫」分頁
            currentTab = 'all'; 
            
            // 2. UI 視覺回饋：重置所有 Chip 顏色，高亮「所有路綫」Chip
            // 假設你的第一個 Chip 是「所有路綫」
            const chips = document.querySelectorAll('.chip');
            chips.forEach(c => {
                c.style.background = 'var(--md-sys-color-surface-variant)';
                // 如果該 Chip 是日曆，保持它有一定的視覺標記（可選）
                if (c.id === 'datePickerChip') {
                    c.style.border = '1.5px solid var(--md-sys-color-primary)'; 
                }
            });
            
            // 高亮第一個「所有路綫」Chip
            if (chips[0]) {
                chips[0].style.background = 'var(--md-sys-color-secondary-container)';
            }

            // 3. 重置排序模式（選做，通常查看歷史建議以時間排序）
            sortMode = 'time';
            if (typeof updateSortUI === 'function') updateSortUI();

            // 4. 抓取數據
            fetchData(val); 
            
            if (navigator.vibrate) navigator.vibrate(5);
        }
    };
}

        function renderList(dataArray, runOccupancy = null) {
            if (isInitialLoadComplete || (dataArray && dataArray.length > 0)) {
                liveList.innerHTML = ''; 
            } else return;

            if (!dataArray || dataArray.length === 0) {
                liveList.innerHTML = '<div style="text-align:center; padding:40px; color:gray;">今日營運時段暫無紀錄</div>';
                return;
            }
            
            const fragment = document.createDocumentFragment();
            dataArray.forEach(item => {
                const desc = getSpecialDesc(item.fullId, specialTrainsConfig);
                let isOutdated = false;
                if (runOccupancy && item.rno) {
                    const owner = runOccupancy.get(item.rno);
                    if (owner && normalizeId(owner.fullId) !== normalizeId(item.fullId)) isOutdated = true;
                }
                fragment.appendChild(createTrainCard(item, desc, isOutdated, specialTrainsConfig));
            });
            liveList.appendChild(fragment);
            triggerListAnimation();
        }


function triggerListAnimation() {
    // 增加檢查：如果 liveList 不存在，立即停止執行
    if (!liveList) return;

    const items = liveList.querySelectorAll('.spotting-card, .fav-item-container');
    
    // 如果項目太多（例如超過 30 個），關閉交錯延遲，改為一次性顯示
    // 這是為了防止動畫隊列太長導致 UI 阻塞
    const isTooMany = items.length > 30;

    items.forEach((item, index) => {
        const cardEl = item.querySelector('.spotting-card') || item;
        if (!cardEl) return;

        const targetOpacity = cardEl.getAttribute('data-target-opacity') || "1";
        
        // 重置狀態
        item.classList.remove('list-fade-in');
        
        // 使用 requestAnimationFrame 來優化性能，而不是直接設置 style
        requestAnimationFrame(() => {
            item.style.setProperty('--target-opacity', targetOpacity);
            item.style.animationDelay = `${index * 20}ms`;
            
            // 強制重繪改為只在動畫開始前執行一次
            void item.offsetWidth; 
            item.classList.add('list-fade-in');
        });
    });
}

        // Firebase 監聽
        const spottingRef = window.ref(window.db, 'live_reports');
        const configRef = window.ref(window.db, 'config/special_trains');

// 監聽配置並初始化數據抓取
        window.onValue(configRef, (configSnap) => {
            specialTrainsConfig = configSnap.val() || {};
            // 根據目前是否已有歷史日期選擇來決定初始抓取
            if (currentTab !== 'history') {
                fetchData(""); // 抓取即時數據 (今日營運)
            }
        });

if (sortToggleBtn) {
    sortToggleBtn.onclick = () => { // 使用 onclick 確保唯一性
        if (currentTab === 'special') {
            if (sortMode === 'time') sortMode = 'route';
            else if (sortMode === 'route') sortMode = 'startDate';
            else sortMode = 'time';
        } else {
            sortMode = (sortMode === 'time') ? 'route' : 'time';
        }
        
        updateSortUI();
        if (navigator.vibrate) navigator.vibrate(5);
        window.applyFiltersAndSearch();
    };
}

// --- 統一的事件處理區域 ---

// 1. 方向切換按鈕 (升降序)
const sortOrderBtn = document.getElementById('sortOrderBtn');
if (sortOrderBtn) {
    sortOrderBtn.onclick = () => {
        isAscending = !isAscending;
        updateSortUI();
        if (navigator.vibrate) navigator.vibrate(5);
        window.applyFiltersAndSearch();
    };
}

if (sortToggleBtn) {
    sortToggleBtn.onclick = () => {
        if (currentTab === 'special') {
            if (sortMode === 'time') sortMode = 'route';
            else if (sortMode === 'route') sortMode = 'startDate';
            else sortMode = 'time';
        } else {
            // 在「所有路綫」或「當日營運」下，只在時間和路綫間切換
            sortMode = (sortMode === 'time') ? 'route' : 'time';
        }
        updateSortUI();
        if (navigator.vibrate) navigator.vibrate(5);
        window.applyFiltersAndSearch();
    };
}

// 尋找這段並修改
chips.forEach(chip => {
    chip.onclick = (e) => {
        const pageTitle = chip.getAttribute('title');

        if (e.target.tagName === 'INPUT') return;


        if (pageTitle === '今期閃卡') {
            currentTab = 'special';
            sortMode = 'startDate';
            isAscending = false;
        } else if (pageTitle === '歷史紀錄') {
            const input = chip.querySelector('input');
            if (input && typeof input.showPicker === 'function') {
                input.showPicker();
            } else if (input) {
                input.click();
            }
        } else {
            currentTab = (pageTitle === '我的最愛') ? 'fav' : 'all';
            if (sortMode === 'startDate') sortMode = 'time';
        }

        if (typeof updateSortUI === 'function') updateSortUI();
        window.applyFiltersAndSearch();
        if (navigator.vibrate) navigator.vibrate(5);
    };
});

        if (searchInput) searchInput.oninput = window.applyFiltersAndSearch;
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

function createTrainCard(data, specialDesc, isOutdated = false, specialConfig = {}) {
    const div = document.createElement('div');
    const routeColor = colorMap[data.rteKey] || '#6750A4';
    
    const carNums = (data.fullId || '').split(/[\+\-–]/).map(n => n.trim());
    const isDouble = carNums.length > 1;

    const icon1 = getCarIcon(carNums[0], specialConfig);
    const icon2 = isDouble ? getCarIcon(carNums[1], specialConfig) : null;

    // --- 修改部分：處理車號點擊 (不改變顏色、無底線、無額外空格) ---
    const rawFullId = data.fullId || '----';
    const displayFullIdHtml = rawFullId.split(/([\+\-–])/).map(part => {
        const trimmed = part.trim();
        // 如果是分隔符 (+, -, –)，直接回傳原始部分
        if (/[\+\-–]/.test(trimmed)) return part;
        
        // 如果是車號，包裹 span 並加上 onclick，顏色繼承父元素 (on-surface)
        return `<span 
            onclick="event.stopPropagation(); window.viewTrainHistory('${trimmed}')" 
            style="cursor: pointer; -webkit-tap-highlight-color: transparent;">${trimmed}</span>`;
    }).join('');

    const statusTextHtml = isOutdated ? `<div style="font-size: 9px; color: var(--md-sys-color-outline); font-weight: 500; margin-bottom: -2px; letter-spacing: 0.5px;">車務調動</div>` : '';
    
    const opacityValue = isOutdated ? "0.5" : "1";
    const opacityStyle = `opacity: ${opacityValue};`;

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
        <div class="spotting-card" 
             data-target-opacity="${opacityValue}"
             style="border-left-color: ${routeColor}; padding: 10px 12px; border-radius: 12px; margin-bottom: 8px; display: flex; flex-direction: column; ${opacityStyle}">
            <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
                <div class="train-icon-container" style="display: flex; align-items: center; flex: 0 0 56px; height: 32px; justify-content: flex-start;">
                    <img src="${icon1}" style="height: 26px; width: 28px; object-fit: contain;">
                    ${isDouble ? `<img src="${icon2}" style="height: 26px; width: 28px; object-fit: contain;">` : ''}
                </div>
                <div style="display: flex; flex-direction: column; flex: 0 0 ${infoWidth}; min-width: ${infoWidth}; overflow: hidden;">
                    ${statusTextHtml}
                    <div style="font-size: 17px; font-weight: 800; color: var(--md-sys-color-on-surface); letter-spacing: -0.5px; line-height: 1.2; width: ${infoWidth}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${displayFullIdHtml}
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
                    <div style="font-size: 10px; color: var(--md-sys-color-outline); font-family: 'Roboto Mono', monospace; font-weight: 500;">
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


const disableSelectStyle = document.createElement('style');
disableSelectStyle.innerHTML = `
    button, input, .nav-filter-btn {
        outline: none !important;
        border: none !important;
        -webkit-tap-highlight-color: transparent !important;
        background: none !important;
    }
    button:focus, input:focus {
        outline: none !important;
    }
    .nav-filter-btn.active, .chip.active {
        background: none !important; 
        color: var(--md-sys-color-primary) !important;
    }
`;
document.head.appendChild(disableSelectStyle);

// 2. 處理篩選按鈕點擊
// --- 1. 取得所有導覽按鈕 (確保對應 HTML 的 nav-filter-btn) ---
const filterBtns = document.querySelectorAll('.nav-filter-btn');

filterBtns.forEach(btn => {
    btn.onclick = () => {
        const title = btn.getAttribute('title');

        // --- 2. UI 切換：移除所有 active 並高亮當前點擊的按鈕 ---
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // --- 3. 數據過濾邏輯 ---
        if (title === '今期閃卡') {
            currentTab = 'special';
            sortMode = 'startDate'; // 閃卡頁預設按上廣日期排序
            isAscending = false;
        } else if (title === '我的最愛') {
            currentTab = 'fav';
            if (sortMode === 'startDate') sortMode = 'time';
        } else {
            // 「所有路綫」
            currentTab = 'all';
            if (sortMode === 'startDate') sortMode = 'time';
        }

        // --- 4. 更新排序 UI 並重新渲染列表 ---
        if (typeof updateSortUI === 'function') updateSortUI();
        window.applyFiltersAndSearch();
        
        if (navigator.vibrate) navigator.vibrate(5);
    };
});

// --- 5. 修正日曆按鈕的獨立邏輯 ---
const dateInput = document.getElementById('hiddenDatePicker');
if (dateInput) {
    dateInput.onchange = (e) => {
        const val = e.target.value;
        if (val) {
            currentTab = 'all'; 

            // --- 關鍵：刪除下面這段會強制加上背景的邏輯 ---
            /* const chips = document.querySelectorAll('.chip');
            chips.forEach(c => {
                c.style.background = 'var(--md-sys-color-surface-variant)';
                ...
            });
            */

            sortMode = 'time';
            if (typeof updateSortUI === 'function') updateSortUI();

            // 執行數據抓取即可，不要去動 UI 顏色
            fetchData(val); 
            
            if (navigator.vibrate) navigator.vibrate(5);
        }
    };
}
document.head.appendChild(disableSelectStyle);


window.viewPhaseDetails = (phaseName, rangeStr) => {
    const contentArea = document.getElementById('app-content');
    const headerTitle = document.getElementById('headerTitle');
    if (!contentArea) return;

    // --- 執行離開動畫 ---
    contentArea.classList.add('page-exit');
    
    // 等待 transition 時間 (250ms) 後再更換內容
    setTimeout(() => {
        // 更新標題並加入返回按鈕
        if (headerTitle) {
            headerTitle.style.display = 'flex';
            headerTitle.style.alignItems = 'center';
            headerTitle.style.gap = '8px';
            headerTitle.innerHTML = `
                <span class="material-symbols-rounded" 
                      style="cursor: pointer; padding: 4px; margin-left: -4px; opacity: 0.8;" 
                      id="phaseDetailBackBtn">
                    arrow_back_ios_new
                </span>
                <span>${phaseName}列車</span>
            `;

            const backBtn = document.getElementById('phaseDetailBackBtn');
            if (backBtn) {
                backBtn.onclick = () => {
                    const navTrainBtn = Array.from(document.querySelectorAll('.nav-item, .tab-item'))
                                            .find(el => el.textContent.includes('列車'));
                    if (navTrainBtn) {
                        navTrainBtn.click();
                    } else if (window.renderPhaseSelection) {
                        window.renderPhaseSelection();
                    } else {
                        window.history.back();
                    }
                };
            }
        }

        // 修改後的邏輯：僅針對列表中精確匹配的車號顯示描述
        const getSpecialData = (specificNum, config) => {
            if (!specificNum || !config) return null;
            const now = new Date();
            const operDate = new Date(now);
            if (now.getHours() < 5) operDate.setDate(now.getDate() - 1);
            const currentOperTime = new Date(operDate.getFullYear(), operDate.getMonth(), operDate.getDate()).getTime();
            
            const targetNum = String(specificNum).trim();
            
            for (let key in config) {
                const theme = config[key];
                // 檢查該主題的車號清單中是否包含這個「特定」車號
                if (theme.cars && theme.cars.includes(targetNum)) {
                    const endT = theme.EndDate ? new Date(theme.EndDate).getTime() : null;
                    if (endT && currentOperTime > endT) continue;
                    
                    const fmtDate = (dStr) => {
                        if (!dStr) return "";
                        const d = new Date(dStr);
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        return `${y}/${m}/${day}`;
                    };
                    
                    return {
                        desc: theme.desc || "",
                        duration: theme.StartDate ? `${fmtDate(theme.StartDate)} - ${fmtDate(theme.EndDate)}` : ""
                    };
                }
            }
            return null; 
        };

        const carNumbers = [];
        rangeStr.split(',').forEach(part => {
            const range = part.split('-').map(n => n.trim());
            if (range.length === 2) {
                for (let i = parseInt(range[0]); i <= parseInt(range[1]); i++) carNumbers.push(String(i));
            } else { carNumbers.push(range[0]); }
        });

        const reports = window.allReports || [];
        const colors = window.colorMap || {};

        const totalTrains = carNumbers.length;
        const trackedTrains = carNumbers.filter(num => 
            reports.some(r => String(r.fullId || '').split(/[\+\-–]/).map(s => s.trim()).includes(num))
        ).length;

        const allRecordsCount = reports.reduce((count, r) => {
            const ids = String(r.fullId || '').split(/[\+\-–]/).map(s => s.trim());
            return count + (ids.some(id => carNumbers.includes(id)) ? 1 : 0);
        }, 0);

        const activeRate = totalTrains > 0 ? ((trackedTrains / totalTrains) * 100).toFixed(1) : 0;

        contentArea.classList.remove('page-exit');
        contentArea.classList.add('page-enter');

        contentArea.innerHTML = `
            <div id="phaseDetailList">
                <div style="padding: 16px; color: var(--md-sys-color-on-surface-variant); display: flex; justify-content: space-between; width: 100%; box-sizing: border-box; gap: 4px;">
                    <div style="display: flex; flex-direction: column; align-items: flex-start; flex: 1;">
                        <div style="width: 100%; text-align: center; font-size: 11px; opacity: 0.8; margin-bottom: 4px;">列車總數</div>
                        <div style="width: 100%; text-align: center; font-size: 22px; font-weight: 800; font-family: 'Roboto Mono', monospace; line-height: 1;">${totalTrains}</div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="width: 100%; text-align: center; font-size: 11px; opacity: 0.8; margin-bottom: 4px;">出車數目</div>
                        <div style="width: 100%; text-align: center; font-size: 22px; font-weight: 800; font-family: 'Roboto Mono', monospace; line-height: 1;">${trackedTrains}</div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="width: 100%; text-align: center; font-size: 11px; opacity: 0.8; margin-bottom: 4px;">行蹤報告</div>
                        <div style="width: 100%; text-align: center; font-size: 22px; font-weight: 800; font-family: 'Roboto Mono', monospace; line-height: 1;">${allRecordsCount}</div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; flex: 1;">
                        <div style="width: 100%; text-align: center; font-size: 11px; opacity: 0.8; margin-bottom: 4px;">出車率</div>
                        <div style="width: 100%; text-align: center; font-size: 22px; font-weight: 800; font-family: 'Roboto Mono', monospace; line-height: 1;">${activeRate}%</div>
                    </div>
                </div>
                <div id="phaseCardsContainer" style="display: flex; flex-direction: column;"></div>
            </div>
        `;
        
        const container = document.getElementById('phaseCardsContainer');

        const renderDescSection = (data, isOffline = false) => {
            if (!data) return '<div style="flex: 1;"></div>';
            const color = isOffline ? 'var(--md-sys-color-outline)' : 'var(--md-sys-color-on-surface)';
            return `
                <div style="min-width: 0; flex: 1; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size: 12px; font-weight: 500; color: ${color}; opacity: 0.8; line-height: 1.2; word-break: break-word;">${data.desc}</div>
                    ${data.duration ? `<div style="font-size: 9px; color: ${color}; opacity: 0.5; margin-top: 2px; font-family: 'Roboto Mono', monospace;">${data.duration}</div>` : ''}
                </div>
            `;
        };

        carNumbers.forEach(num => {
            const report = reports.find(r => 
                String(r.fullId || '').split(/[\+\-–]/).map(s => s.trim()).includes(num)
            );

            const currentConfig = window.specialTrainsConfig || {};
            const iconPath = window.getCarIcon(num, currentConfig);
            
            // 關鍵修改：傳入當前遍歷的單一車號 num 而非 report.fullId，以確保精確判斷
            const specialData = getSpecialData(num, currentConfig);

            const cardWrapper = document.createElement('div');
            const commonStyle = `
                border-radius: 16px; 
                display: flex; 
                align-items: center; 
                background: var(--md-sys-color-surface-container-low); 
                box-shadow: var(--md-sys-elevation-1);
                min-height: 30px;
                padding: 8px 0;
                margin-bottom: 8px;
            `;

            if (report) {
                const routeColor = colors[report.rteKey] || '#6750A4';
                cardWrapper.innerHTML = `
                    <div class="spotting-card" style="${commonStyle}">
                        <div class="train-icon-container" style="display: flex; align-items: center; flex: 0 0 32px; height: 32px; justify-content: center;">
                            <img src="${iconPath}" style="height: 26px; width: 28px; object-fit: contain;">
                        </div>
                        <div style="flex: 0 0 84px;">
                            <div style="font-size: 17px; font-weight: 800; color: var(--md-sys-color-on-surface); line-height: 1.2;">${num}</div>
                            <div style="font-size: 10px; opacity: 0.5; white-space: nowrap;">(${report.fullId})</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; border-left: 1px solid var(--md-sys-color-outline-variant); padding-left: 12px; flex: 1; min-width: 0;">
                            ${renderDescSection(specialData)}
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; margin-left: auto;">
                                <span class="route-badge" style="background: ${routeColor}; color: white; width: 40px; border-radius: 6px; font-size: 12px; text-align: center; font-weight: 700; padding: 1px 0;">${report.rteKey}</span>
                                <span style="border: 1px solid var(--md-sys-color-outline); width: 40px; border-radius: 6px; font-size: 10px; text-align: center; color: var(--md-sys-color-on-surface-variant);">${report.rno}</span>
                            </div>
                            <span class="material-symbols-rounded" style="opacity: 0.3;">chevron_right</span>
                        </div>
                    </div>
                `;
            } else {
                cardWrapper.innerHTML = `
                    <div class="spotting-card" style="${commonStyle} opacity: 0.6;">
                        <div class="train-icon-container" style="display: flex; align-items: center; flex: 0 0 32px; height: 32px; justify-content: center;">
                            <img src="${iconPath}" style="height: 26px; width: 28px; object-fit: contain; filter: grayscale(1); opacity: 0.5;">
                        </div>
                        <div style="flex: 0 0 84px;">
                            <div style="font-size: 17px; font-weight: 800; color: var(--md-sys-color-outline);">${num}</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; border-left: 1px solid var(--md-sys-color-outline-variant); padding-left: 12px; flex: 1; min-width: 0;">
                            ${renderDescSection(specialData, true)}
                            <div style="color: var(--md-sys-color-outline); font-size: 12px; font-weight: 500; flex-shrink: 0; width: 60px; text-align: right; padding-right: 4px; margin-left: auto;">
                                暫無數據
                            </div>
                            <span class="material-symbols-rounded" style="opacity: 0.3;">chevron_right</span>
                        </div>
                    </div>
                `;
            }
            container.appendChild(cardWrapper);
			
			cardWrapper.style.cursor = 'pointer';
			cardWrapper.onclick = () => {
				if (window.viewTrainHistory) {
					// 傳入點擊的單一車號
					window.viewTrainHistory(num);
				}
			};
        });

        requestAnimationFrame(() => {
            contentArea.classList.remove('page-enter');
        });

    }, 250);
};


window.viewTrainHistory = async (carNum) => {
    const contentArea = document.getElementById('app-content');
    const headerTitle = document.getElementById('headerTitle');
    if (!contentArea || !window.db || !window.get) return;

    let selectedDate = new Date(); 
    let viewDate = new Date();     
    let cachedTraces = [];

    contentArea.classList.add('page-exit');
    
    setTimeout(async () => {
        if (headerTitle) {
            const currentConfig = window.specialTrainsConfig || {};
            const mainIcon = window.getCarIcon ? window.getCarIcon(carNum, currentConfig) : "P1R.png";

            const getSpecialDataForHeader = (specificNum, config) => {
                if (!specificNum || !config) return null;
                const targetNum = String(specificNum).trim();
                for (let key in config) {
                    const theme = config[key];
                    if (theme.cars && theme.cars.includes(targetNum)) {
                        const fmt = (dStr) => {
                            if (!dStr) return "";
                            const d = new Date(dStr);
                            return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
                        };
                        return {
                            desc: theme.desc || "",
                            duration: theme.StartDate ? `${fmt(theme.StartDate)} - ${fmt(theme.EndDate)}` : ""
                        };
                    }
                }
                return null;
            };

            const specialInfo = getSpecialDataForHeader(carNum, currentConfig);

            // 移除所有硬編碼的高度，交給 index.html 的 CSS 控制
            headerTitle.style.display = 'flex';
            headerTitle.style.alignItems = 'center';
            headerTitle.style.gap = '10px';
            headerTitle.style.padding = ''; // 清除之前可能殘留的 inline padding
            headerTitle.style.height = '';  // 讓 CSS 接手
            headerTitle.style.minHeight = '';
            headerTitle.style.maxHeight = ''

            headerTitle.innerHTML = `
                <span class="material-symbols-rounded" 
                      style="cursor: pointer; padding: 4px; margin-left: -4px; opacity: 0.8; flex-shrink: 0;" 
                      id="historyBackBtn">
                    arrow_back_ios_new
                </span>
                
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <div style="flex-shrink: 0; width: 24px; display: flex; justify-content: center;">
                        <img src="${mainIcon}" style="height: 18px; width: 24px; object-fit: contain;">
                    </div>
                    
                    <div style="display: flex; flex-direction: column; justify-content: center; line-height: 1.2; min-width: 0;">
                        <div style="font-size: ${specialInfo ? '15px' : '18px'}; font-weight: 900; color: var(--md-sys-color-primary); white-space: nowrap;">
                            ${carNum}
                        </div>
                        ${specialInfo ? `
                            <div style="font-size: 11px; font-weight: 700; color: var(--md-sys-color-on-surface); opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${specialInfo.desc}
                            </div>
                            <div style="font-size: 9px; font-weight: 500; color: var(--md-sys-color-on-surface-variant); opacity: 0.6; font-family: 'Roboto Mono', monospace;">
                                ${specialInfo.duration}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

            document.getElementById('historyBackBtn').onclick = () => {
    // 呼叫顯示主列表或地圖的函數，這取決於你的 script.js 中如何定義首頁視圖
    if (typeof window.renderMainList === 'function') {
        window.renderMainList(); 
    } else {
        // 如果沒有定義特定的返回函數，強制刷新或跳回根路徑
        location.hash = ""; // 或者使用你 App 定義的切換邏輯
    }
};
        }

        contentArea.classList.remove('page-exit');
        contentArea.classList.add('page-enter');
        
        try {
            const snapshot = await window.get(window.ref(window.db, `live_reports/${carNum}`));
            const trainData = snapshot.val();
            // 強制按時間排序
            cachedTraces = (trainData?.traces || []).sort((a, b) => a.timestamp - b.timestamp);
            
            contentArea.innerHTML = `
                <div id="calendar-container" style="padding: 8px 0px 4px 0px;">
                    <div style="background: var(--md-sys-color-surface-container-high); border-radius: 16px; padding: 10px 12px; border: 1px solid var(--md-sys-color-outline-variant);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <div id="calMonthYear" style="font-size: 14px; font-weight: 700; color: var(--md-sys-color-on-surface); margin-left: 4px;"></div>
                            <div style="display: flex; gap: 0px;">
                                <button id="prevMonth" style="background:none; border:none; color:var(--md-sys-color-on-surface-variant); cursor:pointer; scale: 0.8;" class="material-symbols-rounded">chevron_left</button>
                                <button id="nextMonth" style="background:none; border:none; color:var(--md-sys-color-on-surface-variant); cursor:pointer; scale: 0.8;" class="material-symbols-rounded">chevron_right</button>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 10px; font-weight: 700; color: var(--md-sys-color-primary); margin-bottom: 4px; opacity: 0.5;">
                            <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
                        </div>
                        <div id="calendarGrid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;"></div>
                    </div>
                </div>
                <div id="historyList" style="padding: 0px 0px 16px 0px;"></div>
            `;

            const grid = document.getElementById('calendarGrid');
            const monthLabel = document.getElementById('calMonthYear');
            const listContainer = document.getElementById('historyList');

            const renderCalendar = () => {
    grid.innerHTML = '';
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.innerText = `${year}年 ${month + 1}月`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));

    const sortedTraces = [...cachedTraces].sort((a, b) => a.timestamp - b.timestamp);

    for (let d = 1; d <= daysInMonth; d++) {
        const dayBtn = document.createElement('div');
        const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
        const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;
        
        const dStart = new Date(year, month, d).setHours(5, 0, 0, 0);
        const dEnd = dStart + 86400000 - 1;
        
        const dayTraces = sortedTraces.filter(t => t.timestamp >= dStart && t.timestamp <= dEnd);
        
        // --- 變陣偵測 ---
        let isCombinationChanged = false;
        if (dayTraces.length > 0) {
            // 1. 同日內是否有不同 FullID
            const uniqueIds = [...new Set(dayTraces.map(t => String(t.fullId || carNum).trim()))];
            
            // 2. 與前一筆紀錄(跨日)對比
            const firstIdToday = String(dayTraces[0].fullId || carNum).trim();
            const lastRecBefore = sortedTraces.filter(t => t.timestamp < dStart).slice(-1)[0];
            const lastIdBefore = lastRecBefore ? String(lastRecBefore.fullId || carNum).trim() : firstIdToday;

            if (uniqueIds.length > 1 || firstIdToday !== lastIdBefore) {
                isCombinationChanged = true;
            }
        }

        const rawRoutes = dayTraces.map(t => t.rteKey).filter(Boolean);
        const dayRoutes = [...new Set(rawRoutes.flatMap(rte => String(rte).split(/x|\+|\/|&/)))].sort();

        // --- 顏色分配 (修正變量缺失問題) ---
        let dayNumColor = 'var(--md-sys-color-on-surface)'; // 預設 #1C1B1F
        
        if (isSelected) {
            dayNumColor = 'var(--md-sys-color-on-primary)'; // #FFFFFF
        } else if (isCombinationChanged) {
            // 因為你沒定義 tertiary，我們改用一個醒目的顏色
            // 這裡建議用亮紫色或橙色，確保一眼看出不同
            dayNumColor = '#f57c00'; // 橘色，這在紫色主題中非常明顯且易讀
        } else if (isToday) {
            dayNumColor = 'var(--md-sys-color-primary)'; // #6750A4
        }

        dayBtn.style.cssText = `
            min-height: 52px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
            padding: 4px 0; font-size: 13px; font-weight: 800; border-radius: 12px; cursor: pointer;
            background: ${isSelected ? 'var(--md-sys-color-primary)' : 'transparent'};
            ${isToday && !isSelected ? `border: 1.2px solid var(--md-sys-color-primary); padding-top: 2.8px;` : ''}
        `;
        
        dayBtn.innerHTML = `
            <span style="line-height: 1; margin-bottom: 4px; color: ${dayNumColor} !important;">
                ${d}
            </span>
        `;
        
        // 下方的 Badge 邏輯保持不變...
        if (dayRoutes.length > 0) {
            const badgeWrap = document.createElement('div');
            badgeWrap.style.cssText = `display: flex; flex-direction: column; gap: 1.5px; align-items: center; width: 100%;`;
            dayRoutes.slice(0, 2).forEach(rte => {
                const rColor = window.colorMap ? (window.colorMap[rte] || '#6750A4') : '#6750A4';
                const badge = document.createElement('div');
                badge.style.cssText = `font-size: 8px; line-height: 1; padding: 1.5px 3px; border-radius: 3px; font-weight: 900; background: ${rColor}; color: #FFFFFF; min-width: 22px; text-align: center; ${isSelected ? 'box-shadow: 0 0 0 1px var(--md-sys-color-on-primary);' : ''}`;
                badge.innerText = rte;
                badgeWrap.appendChild(badge);
            });
            dayBtn.appendChild(badgeWrap);
        }
        dayBtn.onclick = () => { selectedDate = new Date(year, month, d); renderCalendar(); fetchAndRenderList(); };
        grid.appendChild(dayBtn);
    }
};

            const fetchAndRenderList = () => {
                const start = new Date(selectedDate).setHours(5,0,0,0);
                const end = start + 86400000 - 1;
                const filtered = cachedTraces.filter(t => t.timestamp >= start && t.timestamp <= end).sort((a, b) => b.timestamp - a.timestamp);

                if (filtered.length === 0) {
                    listContainer.innerHTML = `<div style="text-align:center; padding:60px; opacity:0.5; font-size: 14px;" class="list-fade-in">該日無出車紀錄</div>`;
                    return;
                }

                listContainer.innerHTML = '';
                const routeCfg = { "505": ["三聖", "兆康"], "506P": ["兆康"], "507": ["田景", "屯門碼頭"], "507P": ["屯門碼頭"], "610": ["元朗", "屯門碼頭"], "614": ["元朗", "屯門碼頭"], "614P": ["兆康", "屯門碼頭"], "615": ["元朗", "屯門碼頭"], "615P": ["兆康", "屯門碼頭"], "705": ["天水圍循環綫", "以天水圍為終點站"], "706": ["天水圍循環綫", "以天水圍為終點站"], "720": ["天榮"], "751": ["友愛", "天逸"], "751P": ["天水圍", "天逸"], "751L": ["屯門碼頭"], "761P": ["元朗", "天逸"], "不載客": ["三聖", "屯門碼頭", "田景", "兆康", "元朗", "友愛", "天逸", "天榮", "天水圍", "屯門車廠", "洪天路", "---"], "司機訓練": ["三聖", "屯門碼頭", "田景", "兆康", "元朗", "友愛", "天逸", "天榮", "天水圍", "屯門車廠", "洪天路", "---"], "回廠": ["---"], "專用": ["三聖", "屯門碼頭", "田景", "兆康", "元朗", "友愛", "天逸", "天榮", "天水圍", "屯門車廠", "洪天路", "---"], "屯門專綫": ["屯門"], "元朗專綫": ["天逸"] };
                const currentConfig = window.specialTrainsConfig || {};
                
                let currentGroupId = null;
                let animationIndex = 0;

                filtered.forEach((record, idx) => {
                    const recordFullId = record.fullId || String(carNum);
                    
                    if (recordFullId !== currentGroupId) {
                        currentGroupId = recordFullId;
                        const carNums = recordFullId.split(/[\+\-–]/).map(n => n.trim());
                        const icon1 = window.getCarIcon ? window.getCarIcon(carNums[0], currentConfig) : "P1R.png";
                        const icon2 = carNums.length > 1 ? window.getCarIcon(carNums[1], currentConfig) : null;

                        const headerDiv = document.createElement('div');
                        headerDiv.className = 'list-fade-in';
                        headerDiv.style.animationDelay = `${animationIndex++ * 25}ms`;
                        
                        const isFirstGroup = idx === 0;
                        headerDiv.style.cssText = `
                            padding: 2px 0px 6px 15px;
                            margin-top: ${isFirstGroup ? '0px' : '16px'};
                            display: flex; align-items: center; justify-content: flex-start; gap: 8px;
                            background: var(--md-sys-color-surface); opacity: 0.9;
                        `;

                        headerDiv.innerHTML = `
                            <div class="train-icon-container" style="display: flex; align-items: center; height: 16px; gap: 4px;">
                                <img src="${icon1}" style="height: 14px; width: 16px; object-fit: contain;">
                                ${icon2 ? `<img src="${icon2}" style="height: 14px; width: 16px; object-fit: contain;">` : ''}
                            </div>
                            <div style="font-size: 12px; font-weight: 700; color: var(--md-sys-color-on-surface-variant); letter-spacing: 0.2px;">
                                ${recordFullId}
                            </div>
                        `;
                        listContainer.appendChild(headerDiv);
                    }

                    const routeColor = window.colorMap ? (window.colorMap[record.rteKey] || '#6750A4') : '#6750A4';
                    let destination = "---";
                    if (record.dRte && record.dRte.includes('往')) { destination = record.dRte.split('往')[1].trim(); }
                    else if (record.dest) { destination = record.dest; }
                    else if (routeCfg[record.rteKey]) { destination = routeCfg[record.rteKey].join(' / '); }

                    const showDest = destination !== "---";
                    const fullTimeStr = record.timestamp ? new Date(record.timestamp).toTimeString().split(' ')[0] : (record.tStr || "--:--:--");

                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'list-fade-in';
                    cardDiv.style.animationDelay = `${animationIndex++ * 25}ms`;

                    cardDiv.innerHTML = `
                        <div class="spotting-card" 
                             style="border-left: 3.5px solid ${routeColor}; padding: 7.5px 12px; border-radius: 10px; margin-bottom: 4px; background: var(--md-sys-color-surface-container-low); display: flex; flex-direction: column;">
                            <div style="display: flex; align-items: center; gap: 6px; width: 100%; min-width: 0; flex-wrap: nowrap;">
                                <div style="display: flex; align-items: center; gap: 3px; flex-shrink: 0;">
                                    <span style="background: transparent; border: 1px solid var(--md-sys-color-outline); color: var(--md-sys-color-on-surface-variant); padding: 1px 0; width: 32px; border-radius: 3.5px; font-size: 9.5px; text-align: center; box-sizing: border-box; font-weight: 500; flex-shrink: 0;">
                                        ${record.rno || '---'}
                                    </span>
                                    <span class="route-badge" style="background: ${routeColor}; color: #FFFFFF; padding: 1px 4px; min-width: 34px; width: fit-content; border: 1px solid ${routeColor}; border-radius: 3.5px; font-size: 10.5px; text-align: center; font-weight: 700; box-sizing: border-box; flex-shrink: 0; white-space: nowrap;">
                                        ${record.rteKey || '---'}
                                    </span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 5px; min-width: 0; flex: 1;">
                                    ${showDest ? `
                                        <div style="font-size: 13.5px; color: var(--md-sys-color-on-surface); font-weight: 700; white-space: nowrap; flex-shrink: 0;">
                                            ${destination}
                                        </div>
                                        <span style="color: var(--md-sys-color-outline-variant); font-size: 9px; opacity: 0.5; flex-shrink: 0;">|</span>
                                    ` : ''}
                                    <div style="font-size: 11.5px; color: var(--md-sys-color-on-surface-variant); opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        ${record.loc || '未知位置'}
                                    </div>
                                </div>
                                <div style="font-size: 9.5px; color: var(--md-sys-color-outline); font-family: 'Roboto Mono', monospace; font-weight: 600; flex-shrink: 0; margin-left: 2px; letter-spacing: -0.2px;">
                                    ${fullTimeStr}
                                </div>
                            </div>
                            ${record.mem ? `
                                <div style="font-size: 9.5px; color: var(--md-sys-color-primary); font-weight: 500; margin-top: 3px; text-align: left; width: 100%; display: flex; align-items: center; gap: 4px;">
                                    <span class="material-symbols-rounded" style="font-size: 12px; opacity: 0.8;">info</span>
                                    ${record.mem}
                                </div>
                            ` : ''}
                        </div>
                    `;
                    listContainer.appendChild(cardDiv);
                });
            };

            document.getElementById('prevMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
            document.getElementById('nextMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };
            renderCalendar();
            fetchAndRenderList();
        } catch (err) { console.error(err); }
        requestAnimationFrame(() => contentArea.classList.remove('page-enter'));
    }, 250);
};














/// eta ///



/**
 * LRSpotter - ETA 頁面邏輯 (純車序匹配版)
 */
async function initETAPageLogic() {
    const etaList = document.getElementById('text');
    const staIntro = document.getElementById('StaIntro');
    const stationInput = document.getElementById('station_id_input');
	const savedStationId = window.lastSelectedStation || "1";
    
    if (!etaList) return;

    // 你的站點數據
const STATIONS_MAP = { 1: "屯門碼頭", 10: "美樂", 15: "蝴蝶", 20: "輕鐵車廠", 30: "龍門", 40: "青山村", 50: "青雲", 60: "建安", 70: "河田", 75: "蔡意橋", 80: "澤豐", 90: "屯門醫院", 100: "兆康", 110: "麒麟", 120: "青松", 130: "建生", 140: "田景", 150: "良景", 160: "新圍", 170: "石排", 180: "山景(北)", 190: "山景(南)", 200: "鳴琴", 212: "大興(北)", 220: "大興(南)", 230: "銀圍", 240: "兆禧", 250: "屯門泳池", 260: "豐景園", 265: "兆麟", 270: "安定", 275: "友愛", 280: "市中心", 295: "屯門", 300: "杯渡", 310: "何福堂", 320: "新墟", 330: "景峰", 340: "鳳地", 350: "藍地", 360: "泥圍", 370: "鍾屋村", 380: "洪水橋", 390: "塘坊村", 400: "屏山", 425: "坑尾村", 430: "天水圍", 435: "天慈", 445: "天耀", 448: "樂湖", 450: "天湖", 455: "銀座", 460: "天瑞", 468: "頌富", 480: "天富", 490: "翠湖", 500: "天榮", 510: "天悅", 520: "天秀", 530: "濕地公園", 540: "天恆", 550: "天逸", 560: "水邊圍", 570: "豐年路", 580: "康樂路", 590: "大棠路", 600: "元朗", 920: "三聖" };

// 切換列表顯示/隱藏
window.toggleStationList = () => {
    const modal = document.getElementById('StationListModal');
    const isShowing = modal.style.display === 'flex';
    
    if (!isShowing) {
        // 開啟時生成內容
        const content = document.getElementById('StationListContent');
        content.innerHTML = Object.entries(STATIONS_MAP).map(([id, name]) => `
            <div onclick="window.selectStation('${id}')" 
                 style="padding: 14px 16px; margin-bottom: 4px; border-radius: 12px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;"
                 onmouseover="this.style.background='var(--md-sys-color-surface-container-high)'"
                 onmouseout="this.style.background='none'">
                <span style="font-weight: 700; color: var(--md-sys-color-on-surface);">${name}</span>
                <span style="font-family: 'Roboto Mono', monospace; font-size: 12px; opacity: 0.5;">#${id}</span>
            </div>
        `).join('');
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
};

// 選取車站動作
window.selectStation = (id) => {
    const inputEl = document.getElementById('station_id_input');
    inputEl.value = id;
    window.updateStationName(id);
    window.toggleStationList(); // 關閉列表
    window.refreshETADATA();     // 自動執行搜尋
};

// 更新左側站名
window.updateStationName = (id) => {
    const nameSpan = document.getElementById('StationDisplayName');
    if (nameSpan) {
        nameSpan.innerText = STATIONS_MAP[id] || "未知車站";
    }
};
// 清除可能存在的舊定時器，防止記憶體洩漏
if (window.etaTimer) clearInterval(window.etaTimer);

// 每 30 秒自動抓取一次新數據
window.etaTimer = setInterval(() => {
    console.log("自動更新 API 數據...");
    if (typeof window.refreshETADATA === 'function') {
        window.refreshETADATA();
    }
}, 30000);


// 初始化
window.updateStationName("1");


async function getRunOnlyMap() {
    const runMap = new Map();
    try {
        if (!window.db || !window.get) return runMap;

        // --- 核心邏輯：定義今日營運日的 05:00 邊界 ---
        const now = new Date();
        const startBoundDate = new Date(now);
        
        // 如果現在是凌晨 00:00 ~ 04:59，營運日應屬「前一天」
        if (now.getHours() < 5) {
            startBoundDate.setDate(now.getDate() - 1);
        }
        startBoundDate.setHours(5, 0, 0, 0); // 設定為該營運日的 05:00:00
        const startBound = startBoundDate.getTime();

        // 獲取數據
        const snapshot = await window.get(window.ref(window.db, 'live_reports'));

        if (snapshot.exists()) {
            const data = snapshot.val();
            const tempMap = new Map(); // RNO -> { fid: string, ts: number }

            Object.keys(data).forEach(carId => {
                const report = data[carId];
                if (report.traces && Array.isArray(report.traces)) {
                    report.traces.forEach(t => {
                        // --- 嚴格過濾：必須有車序，且時間戳必須大於或等於今日 05:00 ---
                        if (t.rno && t.timestamp >= startBound) {
                            const rnoKey = parseInt(t.rno).toString();
                            const fid = String(t.fullId || carId);
                            
                            const existing = tempMap.get(rnoKey);

                            // 1. 如果該車序還沒紀錄，或是這筆紀錄比現有的更新，則採用
                            if (!existing || t.timestamp > existing.ts) {
                                tempMap.set(rnoKey, { fid: fid, ts: t.timestamp });
                            } 
                            // 2. 如果時間戳完全相同（處理聯結編組同時上傳的情況）
                            else if (t.timestamp === existing.ts) {
                                // 保留資訊較完整的編號（例如 "1001+1066" 長度大於 "1001"）
                                if (fid.length > existing.fid.length) {
                                    tempMap.set(rnoKey, { fid: fid, ts: t.timestamp });
                                }
                            }
                        }
                    });
                }
            });

            // 將過濾後的結果轉入 runMap
            tempMap.forEach((val, rno) => {
                runMap.set(rno, val.fid);
            });
        }
    } catch (e) { 
        console.error("Firebase Sync Error (ETA):", e); 
    }
    return runMap;
}

window.refreshETADATA = async () => {
    const sId = stationInput ? parseInt(stationInput.value) : 1;
    try {
        const [apiRes, liveData] = await Promise.all([
            fetch(`https://lrtapi.lightcatcube.com/api/schedule?station_id=${sId}`).then(r => r.json()),
            getRunOnlyMap()
        ]);

        if (staIntro) staIntro.innerHTML = `<div style="font-weight:900; color:var(--md-sys-color-primary); font-size:17px; margin-bottom: 4px;">${STATIONS_MAP[sId] || "車站"}</div>`;

        let html = "";
        let animationIndex = 0;
        const specialCfg = window.specialTrainsConfig || {};

        apiRes.platform_list?.forEach(platform => {
            html += `<div style="padding: 8px 4px 8px 4px; display: flex;"><div style="background: #FFFFFF; color: var(--md-sys-color-on-surface-variant); padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 900; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid var(--md-sys-color-outline-variant);">${platform.platform_id} 號月台</div></div>`;

platform.route_list?.forEach(route => {
    const routeColor = window.colorMap ? (window.colorMap[route.route_no] || '#6750A4') : '#6750A4';
    
    let raw = route.trip_no ? String(route.trip_no) : (route.train_id !== "0" ? String(route.train_id) : "");
    let runNoRaw = (raw && raw.length > 2) ? raw.substring(0, raw.length - 2) : (raw || "");
    const isInvalid = !runNoRaw || runNoRaw === "undefined" || runNoRaw === "null";
    let runDisp = isInvalid ? "---" : runNoRaw.padStart(3, '0');
    let seqDisp = (raw && raw.length > 2) ? raw.slice(-2) : "01";
    const cleanRunNo = isInvalid ? "0" : parseInt(runNoRaw).toString();
    
    let carNumStr = liveData.get(cleanRunNo) || "";
    if (!carNumStr && route.train_id && route.train_id !== "0") carNumStr = route.train_id;
    const carList = carNumStr ? carNumStr.split(/[\+\-–]/).map(s => s.trim()) : [];
    
    const apiLength = route.train_length; 
    const dbLength = carList.length;      
    const isLengthMismatch = (dbLength > 0 && dbLength !== apiLength);
    
    const lengthLabel = `${apiLength}卡`;
    const mismatchNotice = isLengthMismatch ? 
        `<span style="font-size: 8px; color: var(--md-sys-color-error); font-weight: 900; background: var(--md-sys-color-error-container); padding: 1px 4px; border-radius: 4px; margin-left: 4px; border: 0.5px solid var(--md-sys-color-error);">!</span>` : "";

    html += `
    <div class="list-fade-in" style="animation-delay: ${animationIndex++ * 15}ms;">
        <div class="spotting-card" style="padding: 9px 0; border-radius: 12px; margin-bottom: 6px; background: #FFFFFF; border: 1px solid var(--md-sys-color-outline-variant); border-left: 5.5px solid ${routeColor} !important; display: flex; align-items: center; overflow: hidden;">
            <div style="display: flex; align-items: center; gap: 6px; width: 100%; padding: 0 8px; box-sizing: border-box;">
                
                <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                    <div style="display: flex; align-items: center; justify-content: center; border: 1px solid var(--md-sys-color-outline); border-radius: 4px; width: 42px; height: 18px; background: #fff;">
                        <span style="color: var(--md-sys-color-on-surface-variant); font-size: 9px; font-weight: 600;">${runDisp}</span>
                        <span style="color: var(--md-sys-color-outline); font-size: 8px; opacity: 0.3; margin: 0 1px;">|</span>
                        <span style="color: var(--md-sys-color-on-surface-variant); font-size: 9px; font-weight: 500;">${seqDisp}</span>
                    </div>
                    <span style="background: ${routeColor}; color: #FFFFFF; width: 30px; height: 18px; line-height: 18px; border-radius: 4px; font-size: 10px; text-align: center; font-weight: 900;">${route.route_no}</span>
                </div>
                
                <div style="display: flex; flex-direction: column; flex: 1.5; min-width: 0; overflow: hidden;">
                    <div style="font-size: clamp(11px, 3.5vw, 13.5px); font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">
                        ${route.dest_ch}${mismatchNotice}
                    </div>
                    <div style="font-size: 9px; color: ${isLengthMismatch ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline)'}; font-weight: 800; opacity: 0.7;">
                        ${lengthLabel}
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 3px; flex-shrink: 1; justify-content: flex-end; overflow: hidden;">
                    ${carList.length > 0 ? carList.map((num) => {
                        const icon = window.getCarIcon ? window.getCarIcon(num, specialCfg) : "P1R.png";
                        const bgColor = isLengthMismatch ? 'var(--md-sys-color-error-container)' : '#f5f5f5';
                        return `
                            <div onclick="window.viewTrainHistory('${num}')" 
                                 style="display: flex; align-items: center; gap: 2px; background: ${bgColor}; padding: 1.5px 4px; border-radius: 4px; border: 0.5px solid rgba(0,0,0,0.05); cursor: pointer; flex-shrink: 0;">
                                <img src="${icon}" style="height: 9px; width: 13px; object-fit: contain;">
                                <span style="font-size: 9px; font-family: 'Roboto Mono', monospace; font-weight: 800;">${num}</span>
                            </div>`;
                    }).join('') : '<span style="font-size: 9px; opacity: 0.1;">--</span>'}
                </div>

                <div style="font-size: 13px; font-weight: 900; width: 58px; flex-shrink: 0; text-align: right; color: ${route.time_ch === '正在抵達' ? 'var(--md-sys-color-error)' : '#000000'};">
                    ${route.time_ch}
                </div>
            </div>
        </div>
    </div>`;
});
        });
        etaList.innerHTML = html || `<div style="text-align:center; padding: 60px; opacity: 0.6;">服務已終止</div>`;
    } catch (error) { console.error("ETA Logic Error:", error); }
};
window.refreshETADATA();
}
