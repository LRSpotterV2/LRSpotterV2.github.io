// --- Firebase 模組導入 ---
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, get, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('app-content');
    const headerTitle = document.getElementById('headerTitle');
    const navItems = document.querySelectorAll('.nav-item');

    const auth = getAuth();
    const provider = new GoogleAuthProvider();

window.db = getDatabase();
    window.ref = ref;
    window.onValue = onValue;
    window.set = set;
    window.get = get;
    window.user = null;
    window.favorites = new Set();
	window.db = getDatabase();

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

    onAuthStateChanged(auth, (user) => {
        window.user = user;
        const profileBtn = document.getElementById('userProfileBtn');
        
        if (user) {
            if (profileBtn) {
                profileBtn.innerHTML = `<img src="${user.photoURL}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            }

            const favRef = window.ref(window.db, `users/${user.uid}/favs`);
            window.onValue(favRef, (snapshot) => {
                const data = snapshot.val() || [];
                const favArray = Array.isArray(data) ? data : Object.values(data);
                window.favorites = new Set(favArray.map(String));
                refreshLiveUI();
            });
        } else {
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
	
window.routeConfig = {
    "505": {
        color: "#D92329",
        dest: ["三聖", "兆康"],
        isSingleDirection: false,
        0: [100, 120, 130, 140, 150, 160, 170, 200, 60, 295, 280, 270, 265, 920],
        1: [920, 265, 270, 280, 295, 60, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100]
    },
    "507": {
        color: "#00A551",
        dest: ["田景", "屯門碼頭"],
        isSingleDirection: false,
        0: [1, 230, 240, 250, 260, 265, 270, 280, 295, 70, 75, 230, 220, 212, 160, 150, 140]
    },
    "610": {
        color: "#541B15",
        dest: ["元朗", "屯門碼頭"],
        isSingleDirection: false,
        0: [1, 10, 15, 20, 30, 40, 50, 200, 170, 212, 220, 230, 80, 90, 100, 350, 360, 370, 380, 390, 400, 560, 570, 580, 590, 600]
    },
    "614": {
        color: "#00C0F3",
        dest: ["元朗", "屯門碼頭"],
        isSingleDirection: false,
        0: [1, 240, 250, 260, 265, 270, 280, 300, 310, 320, 330, 340, 100, 350, 360, 370, 380, 390, 400, 560, 570, 580, 590, 600]
    },
    "614P": {
        color: "#F2858E",
        dest: ["兆康", "屯門碼頭"],
        isSingleDirection: false,
        0: [1, 240, 250, 260, 265, 270, 280, 300, 310, 320, 330, 340, 100]
    },
    "615": {
        color: "#FFDD00",
        dest: ["元朗", "屯門碼頭"],
        isSingleDirection: false,
        0: [1, 10, 15, 20, 30, 40, 50, 200, 170, 160, 150, 140, 130, 120, 100, 350, 360, 370, 380, 390, 400, 560, 570, 580, 590, 600]
    },
    "615P": {
        color: "#006585",
        dest: ["兆康", "屯門碼頭"],
        isSingleDirection: false,
        0: [1, 10, 15, 20, 30, 40, 50, 200, 170, 160, 150, 140, 130, 120, 110, 100],
        1: [100, 120, 130, 140, 150, 160, 170, 200, 50, 40, 30, 20, 15, 10, 1]
    },
    "705": {
        color: "#6EBF45",
        dest: ["天水圍循環綫", "以天水圍為終點站"],
        isSingleDirection: true,
        isCircularDirection: true,
        0: [430, 435, 450, 455, 500, 510, 520, 530, 540, 550, 480, 468, 460, 448, 445, 430]
    },
    "706": {
        color: "#B17AB5",
        dest: ["天水圍循環綫", "以天水圍為終點站"],
        isSingleDirection: true,
        isCircularDirection: true,
        0: [430, 445, 448, 460, 468, 480, 550, 540, 530, 520, 510, 500, 455, 450, 435, 430]
    },
    "751": {
        color: "#F48221",
        dest: ["友愛", "天逸"],
        isSingleDirection: false,
        0: [550, 480, 468, 490, 500, 455, 450, 435, 430, 425, 380, 370, 360, 350, 100, 90, 80, 75, 70, 295, 280, 275],
        1: [275, 270, 280, 295, 70, 75, 80, 90, 100, 350, 360, 370, 380, 425, 430, 435, 450, 455, 500, 490, 468, 480, 550]
    },
    "751L": {
        color: "#F48221",
        dest: ["屯門碼頭", "天逸"],
        isSingleDirection: true,
		isSpecialDeparture: true, 
        isSchoolHolidayAvailable: true,
		specialdescription: "到達河田後改行507綫途經屯門前往屯門碼頭",
        0: [550, 480, 468, 490, 500, 455, 450, 435, 430, 425, 380, 370, 360, 350, 100, 90, 80, 75, 70, 295, 280, 270, 265, 260, 250, 240, 1]
    },	
    "751P": {
        color: "#000000",
        dest: ["天水圍", "天逸"],
        isSingleDirection: false,
		isSpecialDeparture: true, 
        0: [550, 480, 468, 490, 500, 455, 450, 435, 430],
    },
    "761P": {
        color: "#6E2C91",
        dest: ["元朗", "天逸"],
        isSingleDirection: false,
        0: [550, 480, 468, 460, 448, 445, 425, 390, 400, 560, 570, 580, 590, 600]
    },
    "506P": {
        color: "#000000",
        dest: ["兆康", "屯門碼頭"],
        isSingleDirection: true,
		isSpecialDeparture: true, 
        isSchoolHolidayAvailable: false,
		specialdescription: "途經龍門、屯門、杯渡、景峰前往兆康",
        0: [1, 10, 15, 20, 30, 40, 50, 60, 295, 300, 310, 320, 330, 340, 100]
    },
    "507P": {
        color: "#00A551",
        dest: ["屯門碼頭", "兆康"],
        isSingleDirection: true,
		isSpecialDeparture: true, 
        isSchoolHolidayAvailable: true,
		specialdescription: "途經青松、建生、田景往屯門碼頭",
        0: [100, 120, 130, 140, 150, 160, 212, 220, 230, 75, 70, 295, 280, 270, 265, 260, 250, 240, 230, 1]
    },
    "720": {
        color: "#000000",
        dest: ["天榮", "兆康"],
        isSingleDirection: true,
		isSpecialDeparture: true, 
        isSchoolHolidayAvailable: false,
		specialdescription: "到達天榮站後改為751P前往天水圍",
        0: [100, 350, 360, 370, 380, 425, 445, 448, 460, 490, 500]
    },
    "不載客": {
        color: "#000000",
        dest: ["三聖", "屯門碼頭", "田景", "兆康", "元朗", "友愛", "天逸", "天榮", "天水圍", "屯門車廠", "洪天路", "---"],
        isNonServiceRoute: true
    },
    "司機訓練": {
        color: "#000000",
        dest: ["三聖", "屯門碼頭", "田景", "兆康", "元朗", "友愛", "天逸", "天榮", "天水圍", "屯門車廠", "洪天路", "---"],
        isNonServiceRoute: true
    },
    "回廠": {
        color: "#000000",
        dest: ["---"],
        isSingleDirection: true,
        isNonServiceRoute: true
    },
    "專用": {
        color: "#000000",
        dest: ["三聖", "屯門碼頭", "田景", "兆康", "元朗", "友愛", "天逸", "天榮", "天水圍", "屯門車廠", "洪天路", "---"],
        isSingleDirection: true,
        isNonServiceRoute: true
    },
    "特別車": {
        color: "#000000",
        dest: ["屯門碼頭", "天逸"],
        isSingleDirection: true,
		isSpecialDeparture: true, 
		specialdescription: "到達兆康站後改為615前往屯門碼頭",
        0: [550, 480, 468, 490, 500, 455, 450, 435, 430, 425, 380, 370, 360, 350, 100, 120, 130, 140, 150, 160, 170, 200, 50, 40, 30, 20, 15, 10, 1]
    }
};
	
const stationConfig = [
    {id:1, zh:"屯門碼頭"},
    {id:10, zh:"美樂"},
    {id:15, zh:"蝴蝶"},
    {id:20, zh:"輕鐵車廠"},
    {id:28, zh:"屯門車廠"},
    {id:30, zh:"龍門"},
    {id:40, zh:"青山村"},
    {id:50, zh:"青雲"},
    {id:60, zh:"建安"},
    {id:70, zh:"河田"},
    {id:75, zh:"蔡意橋"},
    {id:80, zh:"澤豐"},
    {id:90, zh:"屯門醫院"},
    {id:100, zh:"兆康"},
    {id:110, zh:"麒麟"},
    {id:120, zh:"青松"},
    {id:130, zh:"建生"},
    {id:140, zh:"田景"},
    {id:150, zh:"良景"},
    {id:160, zh:"新圍"},
    {id:170, zh:"石排"},
    {id:180, zh:"山景 (北)"},
    {id:190, zh:"山景 (南)"},
    {id:200, zh:"鳴琴"},
    {id:212, zh:"大興 (北)"},
    {id:220, zh:"大興 (南)"},
    {id:230, zh:"銀圍"},
    {id:240, zh:"兆禧"},
    {id:250, zh:"屯門泳池"},
    {id:260, zh:"豐景園"},
    {id:265, zh:"兆麟"},
    {id:270, zh:"安定"},
    {id:275, zh:"友愛"},
    {id:280, zh:"市中心"},
    {id:295, zh:"屯門"},
    {id:300, zh:"杯渡"},
    {id:310, zh:"何福堂"},
    {id:320, zh:"新墟"},
    {id:330, zh:"景峰"},
    {id:340, zh:"鳳地"},
    {id:350, zh:"藍地"},
    {id:360, zh:"泥圍"},
    {id:370, zh:"鍾屋村"},
    {id:380, zh:"洪水橋"},
    {id:385, zh:"洪天路"},
    {id:390, zh:"塘坊村"},
    {id:400, zh:"屏山"},
    {id:425, zh:"坑尾村"},
    {id:430, zh:"天水圍"},
    {id:435, zh:"天慈"},
    {id:445, zh:"天耀"},
    {id:448, zh:"樂湖"},
    {id:450, zh:"天湖"},
    {id:455, zh:"銀座"},
    {id:460, zh:"天瑞"},
    {id:468, zh:"頌富"},
    {id:480, zh:"天富"},
    {id:490, zh:"翠湖"},
    {id:500, zh:"天榮"},
    {id:510, zh:"天悅"},
    {id:520, zh:"天秀"},
    {id:530, zh:"濕地公園"},
    {id:540, zh:"天恒"},
    {id:550, zh:"天逸"},
    {id:560, zh:"水邊圍"},
    {id:570, zh:"豐年路"},
    {id:580, zh:"康樂路"},
    {id:590, zh:"大棠路"},
    {id:600, zh:"元朗"},
    {id:920, zh:"三聖"}
];	
	
// 自動適配器：將新格式動態轉換為舊格式
(function() {
    const generatedCfg = {};
    const generatedColors = {};

    Object.keys(window.routeConfig).forEach(routeId => {
        const data = window.routeConfig[routeId];

        // 1. 生成 routeCfg
        // 如果是單向且 dest 只有一個值，自動補齊為兩個以防舊代碼 index [1] 報錯
        if (data.isSingleDirection && data.dest.length === 1) {
            generatedCfg[routeId] = [data.dest[0], data.dest[0]];
        } else {
            generatedCfg[routeId] = data.dest;
        }

        // 2. 生成 colorMap
        generatedColors[routeId] = data.color;
    });

    // 覆蓋/宣告全域變數，供舊程式碼使用
    window.routeCfg = generatedCfg;
    window.colorMap = generatedColors;
})();	
	
	
const renderStationList = () => {
    const container = document.getElementById('route-stations-container');
    const dirLabel = document.getElementById('dirDisplay');
    if (!container) return;

    const routeConfig = window.routeConfig[routeId];
    let order = null;

    if (routeConfig) {
        if (routeConfig.isSingleDirection) {
            // 如果是單向，永遠使用方向 0
            order = routeConfig[0];
            // 隱藏切換按鈕（選用）
            const switchBtn = document.getElementById('switchDirBtn');
            if (switchBtn) switchBtn.style.display = 'none';
        } else {
            // 雙向邏輯
            if (currentDir === 0) {
                order = routeConfig[0];
            } else {
                // 如果有定義 1 則用 1，否則自動反轉 0
                order = routeConfig[1] || [...routeConfig[0]].reverse();
            }
        }
    }

    const stations = order ? order.map(id => window.stationConfig.find(s => String(s.id) === String(id))).filter(Boolean) : [];
};	

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
                initETAPageLogic();
            } else if (pageId === 'routes') {
                initRoutesPageLogic();
            } else if (pageId === 'submit') { // <--- 加入這段
				initSubmitPageLogic();
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
            if (num >= 1001 && num <= 1012 | num >= 1014 && num <= 1026 | num >= 1028 && num <= 1070) return "P1R.png";
            if (num == 1013) return "P1_1.png";
            if (num == 1027) return "P1_2.png";
            if (num >= 1071 && num <= 1090) return "P2.png";
            if (num >= 1201 && num <= 1210) return "P2T.png";
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
                <span style="font-size: 14px; color: var(--md-sys-color-primary); font-weight: 500; letter-spacing: 0.5px; animation: pulse 1.5s infinite;">同步行蹤記錄...</span>
            </div>
        `;

        if (!window.db || !window.ref || !window.onValue) {
            setTimeout(initLivePageLogic, 200);
            return;
        }

let allReports = [];
let specialTrainsConfig = {};
let runOccupancyData = new Map();
let currentTab = 'all'; 
let isInitialLoadComplete = false;


const stationCfg = stationConfig.reduce((acc, station) => {
    acc[station.id] = station.zh;
    return acc;
}, {});


window.stationConfig = stationConfig;
window.stationCfg = stationCfg;

window.allReports = allReports; 
window.specialTrainsConfig = specialTrainsConfig;
window.runOccupancyData = runOccupancyData;
window.colorMap = colorMap;

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
            liveList.innerHTML = "<p style='text-align:center; padding:40px; color:var(--md-sys-color-outline);'>目前並無主題列車相關記錄</p>";
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
            
            liveList.innerHTML = `<div id="sync-loader" style="display:flex; flex-direction:column; align-items:center; padding:40px 0; gap:16px;"><div class="m3-progress-linear"><div class="m3-progress-bar"></div></div><span style="font-size: 14px; color: var(--md-sys-color-primary); font-weight: 500; letter-spacing: 0.5px; animation: pulse 1.5s infinite;">整理行蹤記錄...</span></div>`;

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
    
    // --- 智慧縮放邏輯 ---
    const rteText = data.rteKey || '---';
    const hasFullWidth = /[^\x00-\xff]/.test(rteText); // 偵測是否含中文
    
    let rteFontSize = '11px'; // 預設字體
    let rteLetterSpacing = 'normal';

    if (hasFullWidth) {
        // 包含中文時，超過 3 個字就縮小
        if (rteText.length > 3) {
            rteFontSize = '9px';
            rteLetterSpacing = '-0.5px';
        }
    } else {
        // 純英文數字時，超過 4 個字才縮小 (例如 "1000P")
        // "761P" (長度為 4) 會保持原本的 11px
        if (rteText.length > 4) {
            rteFontSize = '9px';
            rteLetterSpacing = '-0.5px';
        }
    }

    const carNums = (data.fullId || '').split(/[\+\-–]/).map(n => n.trim());
    const isDouble = carNums.length > 1;

    const icon1 = getCarIcon(carNums[0], specialConfig);
    const icon2 = isDouble ? getCarIcon(carNums[1], specialConfig) : null;

    const rawFullId = data.fullId || '----';
    const displayFullIdHtml = rawFullId.split(/([\+\-–])/).map(part => {
        const trimmed = part.trim();
        if (/[\+\-–]/.test(trimmed)) return part;
        
        // --- 注入返回邏輯 ---
        return `<span 
            onclick="event.stopPropagation(); 
                     // 設定返回動作：回到 Live 頁面
                     window.historyBackAction = () => {
                         if (window.navigateTo) window.navigateTo('live', 'LRSpotter');
                     };
                     window.currentPhaseContext = null; // 確保不會誤入列表返回邏輯
                     window.viewTrainHistory('${trimmed}')" 
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
                        <span class="route-badge" style="
                            background: ${routeColor}; 
                            color: #FFFFFF; 
                            width: 36px; 
                            height: 18px; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            border: 1px solid ${routeColor}; 
                            border-radius: 4px; 
                            font-size: ${rteFontSize}; 
                            letter-spacing: ${rteLetterSpacing}; 
                            text-align: center; 
                            font-weight: 700; 
                            box-sizing: border-box; 
                            white-space: nowrap; 
                            overflow: hidden;">
                            ${rteText}
                        </span>
                        <span style="background: transparent; border: 1px solid var(--md-sys-color-outline); color: var(--md-sys-color-on-surface-variant); width: 36px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 10px; text-align: center; box-sizing: border-box;">
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
    const rteText = report.rteKey || '---';
    
    // --- 動態判斷是否需要縮小 ---
    // 偵測是否包含全形字元 (中文字)
    const hasFullWidth = /[^\x00-\xff]/.test(rteText);
    let rteFontSize = '12px';
    let rteLetterSpacing = '-0.2px';

    if (hasFullWidth) {
        // 包含中文時，超過 3 個字就縮小
        if (rteText.length > 3) {
            rteFontSize = '10px';
            rteLetterSpacing = '-0.5px';
        }
    } else {
        // 純英文數字時，超過 4 個字才縮小 (例如 "1000P")
        if (rteText.length > 4) {
            rteFontSize = '10px';
            rteLetterSpacing = '-0.5px';
        }
    }

    cardWrapper.innerHTML = `
        <div class="spotting-card" style="${commonStyle}">
            <div class="train-icon-container" style="display: flex; align-items: center; flex: 0 0 32px; height: 32px; justify-content: center;">
                <img src="${iconPath}" style="height: 26px; width: 28px; object-fit: contain;">
            </div>
            <div style="flex: 0 0 70px;">
                <div style="font-size: 17px; font-weight: 800; color: var(--md-sys-color-on-surface); line-height: 1.2;">${num}</div>
                <div style="font-size: 10px; opacity: 0.5; white-space: nowrap;">(${report.fullId})</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; border-left: 1px solid var(--md-sys-color-outline-variant); padding-left: 12px; flex: 1; min-width: 0;">
                ${renderDescSection(specialData)}
                <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; margin-left: auto;">
                    
                    <span class="route-badge" style="
                        background: ${routeColor}; 
                        color: white; 
                        width: 40px; 
                        height: 20px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        border-radius: 6px; 
                        font-size: ${rteFontSize}; 
                        letter-spacing: ${rteLetterSpacing};
                        text-align: center; 
                        font-weight: 700; 
                        white-space: nowrap; 
                        overflow: hidden;
                        box-sizing: border-box;
                    ">${rteText}</span>

                    <span style="border: 1px solid var(--md-sys-color-outline); width: 40px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 10px; text-align: center; color: var(--md-sys-color-on-surface-variant); box-sizing: border-box;">
                        ${report.rno}
                    </span>
                </div>
                <span class="material-symbols-rounded" style="opacity: 0.3;">chevron_right</span>
            </div>
        </div>
    `;
} else {
cardWrapper.innerHTML = `
        <div class="spotting-card" style="${commonStyle}">
            <div class="train-icon-container" style="display: flex; align-items: center; flex: 0 0 32px; height: 32px; justify-content: center;">
                <img src="${iconPath}" style="height: 26px; width: 28px; object-fit: contain;">
            </div>
            <div style="flex: 0 0 70px;">
                <div style="font-size: 17px; font-weight: 800; color: var(--md-sys-color-on-surface);">${num}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; border-left: 1px solid var(--md-sys-color-outline-variant); padding-left: 12px; flex: 1; min-width: 0;">
                ${renderDescSection(specialData, false)} 
                <div style="color: var(--md-sys-color-on-surface); opacity: 0.5; font-size: 12px; font-weight: 500; flex-shrink: 0; width: 60px; text-align: right; padding-right: 4px; margin-left: auto;">
                    無資料
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
        // 1. 記錄當前列表的上下文，以便從歷史頁面返回
        window.currentPhaseContext = { 
            name: phaseName, 
            range: rangeStr 
        };
        // 2. 清除其他可能的返回動作，避免衝突
        window.historyBackAction = null; 
        
        window.viewTrainHistory(num);
    }
};
        });

        requestAnimationFrame(() => {
            contentArea.classList.remove('page-enter');
        });

    }, 250);
};


// Alert //
window.m3Alert = (title, message) => {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'm3-dialog-overlay';
        overlay.innerHTML = `
            <div class="m3-dialog">
                <div class="m3-dialog-title">${title}</div>
                <div class="m3-dialog-body">${message}</div>
                <div class="m3-dialog-actions">
                    <button class="m3-btn-text">確定</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // 動畫進場
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.m3-dialog').style.transform = 'translateY(0)';
        }, 10);

        overlay.querySelector('button').onclick = () => {
            overlay.style.opacity = '0';
            overlay.querySelector('.m3-dialog').style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve();
            }, 200);
        };
    });
};

window.m3Snackbar = (message, duration = 3000) => {
    const snack = document.createElement('div');
    snack.className = 'm3-snackbar';
    snack.textContent = message;
    document.body.appendChild(snack);

    // 觸發進場動畫
    requestAnimationFrame(() => {
        snack.classList.add('show');
    });

    // 自動移除
    setTimeout(() => {
        snack.classList.remove('show');
        setTimeout(() => {
            if (snack.parentNode) {
                document.body.removeChild(snack);
            }
        }, 400); // 等待退場動畫結束
    }, duration);
};


// Submit //
// 1. FAB 按鈕點擊動作
window.openWhereabout = () => {
    window.navigateTo('submit', '提交行蹤');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    // 確保 DOM 渲染後執行
    setTimeout(initSubmitPageLogic, 50);
};

function initSubmitPageLogic() {
    const routeSelect = document.getElementById('routeSelect');
    const runNoInput = document.getElementById('runNo');
    const directionSelect = document.getElementById('directionSelect');
    const stationSelect = document.getElementById('stationSelect');

    if (!routeSelect || !runNoInput || !window.routeCfg) return;

    // --- 1. 基礎驗證函數 (與舊版一致) ---
    function checkCarStatus(id) {
        const num = parseInt(id);
        if (isNaN(num)) return { valid: false, msg: "編號格式錯誤" };
        const retiredList = [1013, 1014, 1027];
        const isRetiredRange = (num >= 1071 && num <= 1090) || (num >= 1201 && num <= 1210);
        if (retiredList.includes(num) || isRetiredRange) return { valid: false, msg: `車卡 ${num} 已退役` };
        const inRange = (num >= 1001 && num <= 1162) || (num >= 1201 && num <= 1220);
        return { valid: inRange, msg: inRange ? "" : "車編超出範圍" };
    }

    // --- 2. 聯動更新邏輯 ---
window.onRouteUpdate = () => {
    const rte = routeSelect.value;
    const routeData = window.routeConfig ? window.routeConfig[rte] : null; // 獲取新 Map 的數據
    
    if (!directionSelect || !stationSelect) return;
    
    directionSelect.innerHTML = '';
    stationSelect.innerHTML = '';
    
    // 更新方向選單
    const directions = routeData ? routeData.dest : [];
    directions.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d; opt.textContent = d;
        directionSelect.appendChild(opt);
    });

    const dbList = window.stationConfig || [];
    const isSpecial = routeData?.isNonServiceRoute;

    let filtered;
    if (isSpecial) {
        filtered = [...dbList];
    } else if (routeData) {
        // --- 關鍵改動：從 routeConfig 提取車站 ID 列表 ---
        const routeStations = new Set([
            ...(routeData[0] || []),
            ...(routeData[1] || [])
        ]);
        // 檢查車站 ID 是否在該路線的列表內
        filtered = dbList.filter(s => routeStations.has(Number(s.id)));
    } else {
        filtered = [];
    }

    filtered.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
    stationSelect.innerHTML = filtered.map(s => `<option value="${s.zh}">${s.id} ${s.zh}</option>`).join('');
};

    // --- 3. 自動匹配車序邏輯 ---
    window.checkRunNo = () => {
        const runStr = runNoInput.value.trim();
        let run = parseInt(runStr);
        if (isNaN(run)) return;

        let autoRoute = null, autoDest = null;
        if (run >= 1 && run <= 20) autoRoute = "505";
        else if (run >= 21 && run <= 40) autoRoute = "507";
        else if (run >= 51 && run <= 70) autoRoute = "610";
        else if (run >= 71 && run <= 90) autoRoute = "614";
        else if (run >= 201 && run <= 220) { autoRoute = "614P"; autoDest = "兆康"; }
        else if (run >= 221 && run <= 230) { autoRoute = "614P"; autoDest = "屯門碼頭"; }
        else if ((run >= 91 && run <= 100) || (run >= 191 && run <= 200)) autoRoute = "761P";
        else if (run >= 111 && run <= 130) autoRoute = "615";
        else if ((run >= 131 && run <= 140) || run === 436) autoRoute = "705";
        else if ((run >= 141 && run <= 150) || run === 446) autoRoute = "706";
        else if (run >= 171 && run <= 187) autoRoute = "751";
        else if (run >= 904 && run <= 905) autoRoute = "506P";
        else if (run === 188 || run === 189) autoRoute = "751P";
        else if (run === 868) autoRoute = "TMV";
        else if (run === 871) autoRoute = "YLV";

        if (autoRoute && routeSelect.value !== autoRoute) {
            routeSelect.value = autoRoute;
            window.onRouteUpdate(); 
            if (autoDest) directionSelect.value = autoDest;
        }
    };

    runNoInput.addEventListener('input', window.checkRunNo);

    // 初始填充路綫
    routeSelect.innerHTML = ''; 
    Object.keys(window.routeCfg).sort().forEach(rte => {
        const opt = document.createElement('option');
        opt.value = rte; opt.textContent = rte;
        routeSelect.appendChild(opt);
    });
    window.onRouteUpdate();

    // --- 4. 提交邏輯 ---
    window.submitRecord = async () => {
        const inputIds = document.getElementById('carId').value.trim();
        let runNoVal = runNoInput.value.trim();
        if (!inputIds || !runNoVal) return await window.m3Alert("提交失敗", "請填寫車編及車序");

        // 車編縮寫處理
        let processedInput = inputIds.replace(/\s+/g, '');
        if (processedInput.includes('-') || processedInput.includes('/') || processedInput.includes('.')) {
            let parts = processedInput.split(/[-/.]/);
            if (parts.length === 2) {
                if (parts[0].length === 2) processedInput = `10${parts[0]}-10${parts[1]}`;
                else if (parts[0].length === 3) processedInput = `1${parts[0]}-1${parts[1]}`;
                else if (parts[0].length >= 3 && parts[1].length < parts[0].length) {
                    let prefix = parts[0].substring(0, parts[0].length - parts[1].length);
                    processedInput = `${parts[0]}-${prefix}${parts[1]}`;
                }
            }
        }
        
        const fullId = processedInput;
        const carIds = fullId.split('-');
        for (let id of carIds) {
            const status = checkCarStatus(id);
            if (!status.valid) return await window.m3Alert(status.msg);
        }

        if (!isNaN(runNoVal)) runNoVal = runNoVal.padStart(3, '0');
        
        let now = Date.now();
        let tStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const adminDate = document.getElementById('adminDate')?.value;
        const adminTime = document.getElementById('adminTime')?.value;
        if (window.isAdmin && adminDate) {
            const customDate = new Date(`${adminDate}T${adminTime || "12:00:00"}`);
            if (!isNaN(customDate.getTime())) {
                now = customDate.getTime();
                tStr = `${String(customDate.getHours()).padStart(2, '0')}:${String(customDate.getMinutes()).padStart(2, '0')}`;
            }
        }

        const newTrace = {
            fullId: fullId,
            rno: runNoVal,
            rteKey: routeSelect.value,
            dRte: `${routeSelect.value} 往 ${directionSelect.value}`,
            loc: stationSelect.value,
            mem: document.getElementById('memo').value.trim(),
            tStr: tStr,
            timestamp: now
        };

try {
        const promises = carIds.map(async (carId) => {
            const nodeRef = window.ref(window.db, `live_reports/${carId}`);
            const snap = await window.get(nodeRef);
            let group = snap.val() || { carId: carId, traces: [] };
            if (!Array.isArray(group.traces)) group.traces = [];
            group.traces.push(newTrace);
            group.traces.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            return window.set(nodeRef, group);
        });
        
        await Promise.all(promises);

        // --- 核心改動：非中斷式通知 ---
        window.m3Snackbar("提交成功");

        // 直接清空備註並跳轉，不需要等使用者點擊
        document.getElementById('memo').value = "";
        window.navigateTo('live', 'LRSpotter');
        
    } catch (err) {
        // 失敗時建議仍使用 m3Alert 或 Snackbar 提示錯誤
        console.error(err);
        if (window.m3Alert) await window.m3Alert("錯誤", "提交失敗: " + err.message);
    }
    };
}











// Train //

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

            // 在 viewTrainHistory 內部修改返回按鈕
document.getElementById('historyBackBtn').onclick = () => {
    // 檢查是否有特定的返回動作 (Callback)
    if (window.historyBackAction) {
        window.historyBackAction();
        window.historyBackAction = null; // 執行後清除
        return;
    }

    // 如果是從 PhaseDetails 進入的（利用上一則建議的 Context）
    if (window.currentPhaseContext && window.viewPhaseDetails) {
        const { name, range } = window.currentPhaseContext;
        // 清除 Context 避免下次從別處進入時誤判
        window.currentPhaseContext = null; 
        window.viewPhaseDetails(name, range);
        return;
    }

    // 預設行為：嘗試瀏覽器回退，若無紀錄則回主列表
    if (window.history.length > 1) {
        window.history.back();
    } else if (typeof window.renderMainList === 'function') {
        window.renderMainList();
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
        
        // --- 路線 Badge 邏輯 (最多顯示 3 個，超過顯示 +n) ---
        if (dayRoutes.length > 0) {
            const badgeWrap = document.createElement('div');
            badgeWrap.style.cssText = `display: flex; flex-direction: column; gap: 1.5px; align-items: center; width: 100%;`;
            
            // 決定顯示的內容：最多 3 個 Badge，或 2 個 Badge + 1 個數字標記
            const maxVisible = 3;
            const needsPlusN = dayRoutes.length > maxVisible;
            const displayRoutes = needsPlusN ? dayRoutes.slice(0, 2) : dayRoutes.slice(0, 3);

            // 渲染路線 Badge
            displayRoutes.forEach(rte => {
                const rColor = window.colorMap ? (window.colorMap[rte] || '#6750A4') : '#6750A4';
                const badge = document.createElement('div');
                badge.style.cssText = `
                    font-size: 8px; line-height: 1; padding: 1.5px 3px; border-radius: 3px; 
                    font-weight: 900; background: ${rColor}; color: #FFFFFF; 
                    min-width: 22px; text-align: center; 
                    ${isSelected ? 'box-shadow: 0 0 0 1px var(--md-sys-color-on-primary);' : ''}
                `;
                badge.innerText = rte;
                badgeWrap.appendChild(badge);
            });

            // 渲染 +n 標記
            if (needsPlusN) {
                const plusN = document.createElement('div');
                const remaining = dayRoutes.length - 2;
                plusN.style.cssText = `
                    font-size: 8px; font-weight: 800; line-height: 1;
                    color: ${isSelected ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-primary)'};
                    opacity: 0.8; margin-top: 1px;
                `;
                plusN.innerText = `+${remaining}`;
                badgeWrap.appendChild(plusN);
            }
            
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
async function initETAPageLogic() {
    const etaList = document.getElementById('text');
    const staIntro = document.getElementById('StaIntro');
    const stationInput = document.getElementById('station_id_input');
    const stationSelect = document.getElementById('station_select');
    
    if (!etaList) return;

    // 1. 初始化月台摺疊狀態物件
    if (window.etaCollapseStates === undefined) window.etaCollapseStates = {};

    // 2. 動態注入動畫與旋轉樣式
    if (!document.getElementById('eta-page-styles')) {
        const style = document.createElement('style');
        style.id = 'eta-page-styles';
        style.innerHTML = `
            @keyframes eta-blink-effect {
                0% { opacity: 1; }
                50% { opacity: 0.25; }
                100% { opacity: 1; }
            }
            .eta-flashing {
                animation: eta-blink-effect 1.2s infinite ease-in-out !important;
            }

            @keyframes eta-unfold-anim {
                0% { 
                    opacity: 0; 
                    transform: perspective(1000px) rotateX(-45deg);
                    transform-origin: top;
                }
                100% { 
                    opacity: 1; 
                    transform: perspective(1000px) rotateX(0deg);
                    transform-origin: top;
                }
            }
            
            .list-unfold {
                animation: eta-unfold-anim 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                opacity: 0;
                backface-visibility: hidden;
            }

            .collapse-btn-active {
                /* 移除紫色，改為與 surface 一致 */
                background: var(--md-sys-color-surface) !important;
                color: var(--md-sys-color-on-surface) !important;
                border: 1px solid var(--md-sys-color-outline) !important;
            }

            /* 箭頭旋轉動畫 */
            .eta-collapse-icon {
                display: inline-block;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-size: 20px;
                line-height: 1;
            }
            
            /* 當展開時（isPlatformCollapsed 為 false），旋轉 180 度指向上方 */
            .eta-icon-rotated {
                transform: rotate(180deg);
            }

            .eta-collapse-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 44px;
                height: 26px;
                padding: 0 8px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                border: 1px solid var(--md-sys-color-surface-variant);
                background: var(--md-sys-color-surface);
                -webkit-tap-highlight-color: transparent;
            }
        `;
        document.head.appendChild(style);
    }

    const stationCfg = { 1: "屯門碼頭", 10: "美樂", 15: "蝴蝶", 20: "輕鐵車廠", 30: "龍門", 40: "青山村", 50: "青雲", 60: "建安", 70: "河田", 75: "蔡意橋", 80: "澤豐", 90: "屯門醫院", 100: "兆康", 110: "麒麟", 120: "青松", 130: "建生", 140: "田景", 150: "良景", 160: "新圍", 170: "石排", 180: "山景(北)", 190: "山景(南)", 200: "鳴琴", 212: "大興(北)", 220: "大興(南)", 230: "銀圍", 240: "兆禧", 250: "屯門泳池", 260: "豐景園", 265: "兆麟", 270: "安定", 275: "友愛", 280: "市中心", 295: "屯門", 300: "杯渡", 310: "何福堂", 320: "新墟", 330: "景峰", 340: "鳳地", 350: "藍地", 360: "泥圍", 370: "鍾屋村", 380: "洪水橋", 390: "塘坊村", 400: "屏山", 425: "坑尾村", 430: "天水圍", 435: "天慈", 445: "天耀", 448: "樂湖", 450: "天湖", 455: "銀座", 460: "天營", 468: "頌富", 480: "天富", 490: "翠湖", 500: "天榮", 510: "天悅", 520: "天秀", 530: "濕地公園", 540: "天恆", 550: "天逸", 560: "水邊圍", 570: "豐年路", 580: "康樂路", 590: "大棠路", 600: "元朗", 920: "三聖" };
    window.stationCfg = stationCfg;

    let forceRefreshAnimation = false;

    async function getRunOnlyMap() {
        const runMap = new Map();
        try {
            if (!window.db || !window.get) return runMap;
            const now = new Date();
            const startBoundDate = new Date(now);
            if (now.getHours() < 5) startBoundDate.setDate(now.getDate() - 1);
            startBoundDate.setHours(5, 0, 0, 0);
            const startBound = startBoundDate.getTime();
            const snapshot = await window.get(window.ref(window.db, 'live_reports'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const tempMap = new Map();
                Object.keys(data).forEach(carId => {
                    const report = data[carId];
                    if (report.traces && Array.isArray(report.traces)) {
                        report.traces.forEach(t => {
                            if (t.rno && t.timestamp >= startBound) {
                                const rnoKey = parseInt(t.rno, 10).toString();
                                const fid = String(t.fullId || carId);
                                const existing = tempMap.get(rnoKey);
                                if (!existing || t.timestamp > existing.ts) {
                                    tempMap.set(rnoKey, { fid: fid, ts: t.timestamp });
                                } else if (t.timestamp === existing.ts && fid.length > existing.fid.length) {
                                    tempMap.set(rnoKey, { fid: fid, ts: t.timestamp });
                                }
                            }
                        });
                    }
                });
                tempMap.forEach((val, rno) => runMap.set(rno, val.fid));
            }
        } catch (e) { console.error("Firebase Sync Error:", e); }
        return runMap;
    }

    window.toggleETACollapse = (pId) => {
        // 預設是 true (摺疊)
        const currentState = window.etaCollapseStates[pId] !== false;
        window.etaCollapseStates[pId] = !currentState;
        forceRefreshAnimation = true; 
        performDataRefresh();
    };

    async function performDataRefresh() {
        const rawId = stationInput ? stationInput.value : "1";
        const sId = parseInt(rawId) || 1;

        try {
            const [apiRes, liveData] = await Promise.all([
                fetch(`https://lrtapi.lightcatcube.com/api/schedule?station_id=${sId}`).then(r => r.json()),
                getRunOnlyMap()
            ]);

            if (staIntro) {
                const name = stationCfg[sId] || "車站";
                staIntro.innerHTML = `<div style="font-weight:900; color:var(--md-sys-color-primary); font-size:17px; margin-bottom: 4px;">${name}</div>`;
            }

            let nextHtml = "";
            let animationIndex = 0;
            const specialCfg = window.specialTrainsConfig || {};
            const animClass = forceRefreshAnimation ? 'list-unfold' : '';

            apiRes.platform_list?.forEach(platform => {
                const pId = platform.platform_id;
                const routes = platform.route_list || [];
                const hasRoutes = routes.length > 0;
                
                // 檢查是否有重複路綫，若無重複則不需要顯示按鈕
                const routeNos = routes.map(r => r.route_no);
                const hasRepeatingInfo = new Set(routeNos).size !== routeNos.length;

                // 若無重複資訊，強制設為展開狀態 (false)
                const isPlatformCollapsed = hasRepeatingInfo ? (window.etaCollapseStates[pId] !== false) : false;

                nextHtml += `
                <div class="${animClass}" style="animation-delay: ${animationIndex++ * 20}ms;">
                    <div style="padding: 8px 4px 8px 4px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="background: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface-variant); padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 900; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid var(--md-sys-color-surface-variant);">
                            ${pId} 號月台
                        </div>
                        ${hasRoutes && hasRepeatingInfo ? `
                            <div onclick="window.toggleETACollapse('${pId}')" class="eta-collapse-btn ${!isPlatformCollapsed ? 'collapse-btn-active' : ''}">
                                <span class="material-symbols-rounded eta-collapse-icon ${!isPlatformCollapsed ? 'eta-icon-rotated' : ''}" 
                                      style="opacity: 0.4;">
                                    expand_more
                                </span>
                            </div>
                        ` : (hasRoutes ? '' : `
                            <div style="background: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface-variant); padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 900; opacity: 0.6; border: 1px solid var(--md-sys-color-surface-variant);">是日列車服務已經終止</div>
                        `)}
                    </div>
                </div>`;

                if (hasRoutes) {
                    const renderedRoutes = new Set();
                    routes.forEach(route => {
                        if (isPlatformCollapsed) {
                            if (renderedRoutes.has(route.route_no)) return;
                            renderedRoutes.add(route.route_no);
                        }

                        const routeColor = window.colorMap ? (window.colorMap[route.route_no] || 'var(--md-sys-color-primary)') : 'var(--md-sys-color-primary)';
                        let raw = route.trip_no ? String(route.trip_no) : (route.train_id !== "0" ? String(route.train_id) : "");
                        let runNoRaw = (raw && raw.length > 2) ? raw.substring(0, raw.length - 2) : (raw || "");
                        let runDisp = (!runNoRaw || runNoRaw === "undefined") ? "---" : runNoRaw.padStart(3, '0');
                        let seqDisp = (raw && raw.length > 2) ? raw.slice(-2) : "01";
                        const cleanRunNo = runNoRaw ? parseInt(runNoRaw, 10).toString() : "0";
                        let carNumStr = liveData.get(cleanRunNo) || (route.train_id !== "0" ? route.train_id : "");
                        const carList = carNumStr ? carNumStr.split(/[\+\-–]/).map(s => s.trim()) : [];
                        const isLengthMismatch = (carList.length > 0 && carList.length !== route.train_length);
                        const isArrivingNow = route.time_ch === '正在抵達';
                        const isSoonOrLeaving = (route.time_ch === '即將抵達' || route.time_ch === '正在離開');
                        const timeColor = isArrivingNow ? '#B3261E' : (isSoonOrLeaving ? 'var(--md-sys-color-outline)' : 'var(--md-sys-color-on-surface)');
                        const flashClass = (isArrivingNow || isSoonOrLeaving) ? 'eta-flashing' : '';

                        nextHtml += `
                        <div class="${animClass}" style="animation-delay: ${animationIndex++ * 20}ms;">
                            <div class="spotting-card" style="padding: 9px 0; border-radius: 12px; margin-bottom: 6px; border: 1px solid var(--md-sys-color-surface-variant); border-left: 5.5px solid ${routeColor} !important; display: flex; align-items: center; overflow: hidden;">
                                <div style="display: flex; align-items: center; gap: 6px; width: 100%; padding: 0 8px; box-sizing: border-box;">
                                    <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                                        <div style="display: flex; align-items: center; justify-content: center; border: 1px solid var(--md-sys-color-outline); border-radius: 4px; width: 42px; height: 18px;">
                                            <span style="color: var(--md-sys-color-on-surface-variant); font-size: 9px; font-weight: 600;">${runDisp}</span>
                                            <span style="color: var(--md-sys-color-outline); font-size: 8px; opacity: 0.3; margin: 0 1px;">|</span>
                                            <span style="color: var(--md-sys-color-on-surface-variant); font-size: 9px; font-weight: 500;">${seqDisp}</span>
                                        </div>
                                        <span style="background: ${routeColor}; color: var(--md-sys-color-on-primary); width: 30px; height: 18px; line-height: 18px; border-radius: 4px; font-size: 10px; text-align: center; font-weight: 900;">${route.route_no}</span>
                                    </div>
                                    <div style="display: flex; flex-direction: column; flex: 1.5; min-width: 0; overflow: hidden;">
                                        <div style="font-size: clamp(11px, 3.5vw, 13.5px); font-weight: 900; color: var(--md-sys-color-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">${route.dest_ch}</div>
                                        <div style="display: flex; align-items: center; font-size: 9px; color: ${isLengthMismatch ? '#f57c00' : 'var(--md-sys-color-on-surface-variant)'}; font-weight: 800; opacity: 0.7; height: 9px;">
                                            ${isLengthMismatch ? `<span style="display: inline-flex; align-items: center; justify-content: center; width: 9px; height: 9px; border: 0.8px solid #f57c00; border-radius: 50%; font-size: 6px; color: #f57c00; font-weight: 900; margin-right: 3px; flex-shrink: 0; box-sizing: border-box; line-height: 1; padding-top: 0.5px;">!</span>` : ''}
                                            <span style="line-height: 9px;">${route.train_length}卡</span>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 3px; flex-shrink: 1; justify-content: flex-end; overflow: hidden;">
                                        ${carList.length > 0 ? carList.map((num) => {
    const icon = window.getCarIcon ? window.getCarIcon(num, specialCfg) : "P1R.png";
    return `
        <div onclick="
            event.stopPropagation(); 
            // 1. 設定返回動作：回到當前的 ETA 頁面（假設你的渲染函數是 renderETAPage）
            window.historyBackAction = () => {
                if (window.renderETAPage) {
                    window.renderETAPage();
                } else {
                    // 如果沒有專門的渲染函數，則使用通用導航
                    if (window.navigateTo) window.navigateTo('eta', 'ETA');
                }
            };
            // 2. 清除列表上下文，確保返回邏輯精確
            window.currentPhaseContext = null; 
            window.viewTrainHistory('${num}');
        " 
        style="display: flex; align-items: center; gap: 2px; padding: 1.5px 4px; border-radius: 4px; border: 0.5px solid rgba(0,0,0,0.05); cursor: pointer;">
            <img src="${icon}" style="height: 9px; width: 13px; object-fit: contain;">
            <span style="font-size: 9px; font-family: 'Roboto Mono', monospace; font-weight: 800; color: var(--md-sys-color-on-surface);">${num}</span>
        </div>`;
}).join('') : '<span style="font-size: 9px; opacity: 0.2;">--</span>'}
                                    </div>
                                    <div class="${flashClass}" style="font-size: 13px; font-weight: 900; width: 58px; flex-shrink: 0; text-align: right; color: ${timeColor};">
                                        ${route.time_ch}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    });
                }
            });

            const finalHtml = nextHtml || `<div style="text-align:center; padding: 60px; opacity: 0.6; color: var(--md-sys-color-on-surface-variant);">查無資料</div>`;

            if (forceRefreshAnimation || etaList.innerHTML !== finalHtml) {
                etaList.innerHTML = finalHtml;
                forceRefreshAnimation = false; 
            }
            
        } catch (error) { console.error("ETA API Error:", error); }
    }

    if (stationSelect) {
        stationSelect.innerHTML = Object.entries(stationCfg)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .map(([id, name]) => `<option value="${id}">${id} ${name}</option>`)
            .join('');
    }

    window.selectStation = (id) => {
        const numericId = parseInt(id);
        if (isNaN(numericId)) return;
        if (stationInput) stationInput.value = numericId;
        if (stationSelect) stationSelect.value = numericId;
        forceRefreshAnimation = true; 
        performDataRefresh();
    };

    window.updateStationName = (id) => {
        const numericId = parseInt(id);
        if (stationSelect) stationSelect.value = numericId;
    };

    if (window.etaTimer) clearInterval(window.etaTimer);
    window.etaTimer = setInterval(() => { performDataRefresh(); }, 10000);

    window.refreshETADATA = () => {
        forceRefreshAnimation = true; 
        performDataRefresh();
    };

    const initialId = stationInput ? parseInt(stationInput.value) : 1;
    window.updateStationName(initialId);
    performDataRefresh();
}








/// route ///
/**
 * LRSpotter - 輕鐵網絡 (Routes) 頁面邏輯
 */
window.initRoutesPageLogic = function() {
    const routesGrid = document.getElementById('routes-grid');
    if (!routesGrid || !window.routeCfg || !window.routeConfig) return;

    const excludeRoutes = ["不載客", "司機訓練", "回廠", "專用", "屯門專綫", "元朗專綫"];
    const specialRoutesList = ["506P", "507P", "720", "751L", "特別車"];

    const sortedRoutes = Object.keys(window.routeCfg)
        .filter(rte => !excludeRoutes.includes(rte))
        .sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (numA !== numB) return numA - numB;
            return a.localeCompare(b);
        });

    let normalHtml = `<div style="grid-column: span 2; margin: 5px 0 5px 0; font-weight: 800; opacity: 0.7; font-size: 13px; color: var(--md-sys-color-on-surface); width: 100%; box-sizing: border-box;">常規路綫</div>`;
    let specialHtml = `<div style="grid-column: span 2; margin: 16px 0 5px 0; font-weight: 800; opacity: 0.7; font-size: 13px; color: var(--md-sys-color-on-surface); width: 100%; box-sizing: border-box;">只於指定日子及時段服務</div>`;

    let hasSpecial = false;

    sortedRoutes.forEach(rte => {
        const isSpecial = specialRoutesList.includes(rte);
        const color = window.colorMap[rte] || 'var(--md-sys-color-primary)';
        const config = window.routeConfig[rte];
        
        let dests = "";
        
        // 修正後的判斷邏輯：
        // 必須符合 isSingleDirection，且「不能」是 isCircularDirection
        if (config && config.isSingleDirection && !config.isCircularDirection && config.dest && config.dest.length >= 2) {
            // 純單向路綫顯示格式：起點 → 目的地
            dests = `${config.dest[1]} → ${config.dest[0]}`;
        } else {
            // 常規雙向路綫或循環線邏輯
            const destArray = window.routeCfg[rte].filter(d => d !== "以天水圍為終點站");
            dests = destArray.join(' ⇌ ');
        }

        const cardHtml = `
        <div class="spotting-card route-card-btn" data-route="${rte}" 
             style="border-left: 6px solid ${color}; 
                    padding: 8px 10px; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    gap: 8px; 
                    min-height: 44px; 
                    border-radius: 12px; 
                    width: 100%;
                    box-sizing: border-box;
                    overflow: hidden;">
            
            <div style="background: ${color}; color: white; font-weight: 900; font-size: 12px; padding: 2px 0; border-radius: 4px; min-width: 40px; text-align: center; line-height: 1.2; flex-shrink: 0;">
                ${rte}
            </div>

            <div style="font-size: 12px; color: var(--md-sys-color-on-surface); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; letter-spacing: -0.2px;">
                ${dests}
            </div>
        </div>`;

        if (isSpecial) {
            specialHtml += cardHtml;
            hasSpecial = true;
        } else {
            normalHtml += cardHtml;
        }
    });
    
    routesGrid.innerHTML = normalHtml + (hasSpecial ? specialHtml : "");

    // 點擊邏輯
    document.querySelectorAll('.route-card-btn').forEach(card => {
        card.onclick = () => {
            const rte = card.getAttribute('data-route');
            if (window.viewRouteDetail) {
                window.viewRouteDetail(rte);
            }
        };
    });
};




// Route Detail //
let currentUpdateId = 0;
window.viewRouteDetail = async (routeId) => {
    const contentArea = document.getElementById('app-content');
    const headerTitle = document.getElementById('headerTitle');
    const profileBtn = document.getElementById('userProfileBtn');
    if (!contentArea || !window.db || !window.get) return;

    const routeConfigData = window.routeConfig[routeId];
    const routeColor = window.colorMap[routeId] || 'var(--md-sys-color-primary)';
    const routeDest = window.routeCfg[routeId] || ["終點", "終點"];
    
    let currentDir = 0;

    const getRunOnlyMap = async () => {
        const runMap = new Map();
        try {
            if (!window.db || !window.get) return runMap;
            const now = new Date();
            const startBoundDate = new Date(now);
            if (now.getHours() < 5) startBoundDate.setDate(now.getDate() - 1);
            startBoundDate.setHours(5, 0, 0, 0);
            const startBound = startBoundDate.getTime();

            const snapshot = await window.get(window.ref(window.db, 'live_reports'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const tempMap = new Map();
                Object.keys(data).forEach(carId => {
                    const report = data[carId];
                    if (report.traces && Array.isArray(report.traces)) {
                        report.traces.forEach(t => {
                            if (t.rno && t.timestamp >= startBound) {
                                const rnoKey = parseInt(t.rno, 10).toString();
                                const fid = String(t.fullId || carId);
                                const existing = tempMap.get(rnoKey);
                                if (!existing || t.timestamp > existing.ts) {
                                    tempMap.set(rnoKey, { fid: fid, ts: t.timestamp });
                                } else if (t.timestamp === existing.ts && fid.length > existing.fid.length) {
                                    tempMap.set(rnoKey, { fid: fid, ts: t.timestamp });
                                }
                            }
                        });
                    }
                });
                tempMap.forEach((val, rno) => runMap.set(rno, val.fid));
            }
        } catch (e) { console.error("Firebase Sync Error:", e); }
        return runMap;
    };

    contentArea.classList.add('page-exit');
    setTimeout(async () => {
        if (headerTitle) {
            headerTitle.parentElement.style.display = 'flex';
            headerTitle.parentElement.style.alignItems = 'center';
            headerTitle.parentElement.style.justifyContent = 'space-between';
            if (profileBtn) profileBtn.style.flexShrink = '0';

            headerTitle.style.display = 'flex';
            headerTitle.style.alignItems = 'center';
            headerTitle.style.gap = '8px';
            headerTitle.style.flexGrow = '1';
            headerTitle.style.minWidth = '0px';
            headerTitle.style.padding = '0px';

            const isCircular = routeConfigData && routeConfigData.isCircularDirection;
            const prefix = isCircular ? '' : '往 ';

            // 先取得對應路線的配置
const currentRouteCfg = window.routeConfig[routeId];
// 取得特殊描述，若無則留空或設定預設值
const specialDesc = (currentRouteCfg && currentRouteCfg.specialdescription) ? currentRouteCfg.specialdescription : "";

headerTitle.innerHTML = `
    <span class="material-symbols-rounded" style="cursor: pointer; padding: 4px; margin-left: -4px; opacity: 0.8; flex-shrink: 0;" id="phaseDetailBackBtn">
        arrow_back_ios_new
    </span>
    <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex-grow: 1;">
        <div style="background: ${routeColor}; color: white; font-weight: 900; font-size: 13px; padding: 3px 8px; border-radius: 6px; flex-shrink: 0; line-height: 1.2;">
            ${routeId}
        </div>
        
        <div style="display: flex; flex-direction: column; min-width: 0; justify-content: center; line-height: 1.2;">
            <div id="dirToggleArea" style="display: flex; align-items: center; gap: 4px; cursor: pointer; min-width: 0; user-select: none;">
                <span id="dirDisplay" style="font-size: 15px; font-weight: 800; color: var(--md-sys-color-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${prefix}${routeDest[0]}
                </span>
                <span class="material-symbols-rounded" id="swapIcon" style="font-size: 18px; color: var(--md-sys-color-on-surface); opacity: 0.7; flex-shrink: 0;">
                    swap_vert
                </span>
            </div>
            
            ${specialDesc ? `
            <div style="font-size: 11px; font-weight: 700; color: var(--md-sys-color-on-surface); opacity: 0.55; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">
                ${specialDesc}
            </div>` : ''}
        </div>
    </div>
`;
            
            document.getElementById('phaseDetailBackBtn').onclick = () => {
                const btn = Array.from(document.querySelectorAll('.nav-item')).find(el => el.getAttribute('data-page') === 'routes');
                if (btn) btn.click();
            };

            const toggleArea = document.getElementById('dirToggleArea');
            if (toggleArea) {
                toggleArea.onclick = () => {
                    if (routeConfigData && routeConfigData.isSingleDirection) return;
                    currentDir = currentDir === 0 ? 1 : 0;
                    renderStationList();
                };
            }
        }

        contentArea.innerHTML = `
            <div style="padding: 0px 0;">
                <div id="service-status-banner" style="display: none; margin: 0 16px 12px 16px; background: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); border-radius: 16px; align-items: center; gap: 10px; animation: tagFadeIn 0.5s ease forwards;">
                    <span class="material-symbols-rounded" style="font-size: 20px;">info</span>
                    <span id="service-status-text" style="font-size: 13px; font-weight: 700;">暫時無法提供相關資料</span>
                </div>

                <div class="glass-effect" style="margin-bottom: 20px; border-radius: 28px; background: var(--md-sys-color-surface-container-lowest); border: 1px solid var(--md-sys-color-outline-variant); position: relative; overflow: hidden;">
                    <div id="map-scroll-area" style="max-height: calc(100vh - 200px); overflow-y: auto; scrollbar-width: none; position: relative;">
                        <div id="static-track" style="position: absolute; width: 8px; background: ${routeColor}; opacity: 1; left: 30%; transform: translateX(-50%); z-index: 1; border-radius: 4px;"></div>
                        <div id="route-stations-container" style="position: relative; width: 100%; display: flex; flex-direction: column; align-items: center; z-index: 2; background: transparent;"></div>
                    </div>
                </div>
            </div>
        `;

        const renderStationList = () => {
    const container = document.getElementById('route-stations-container');
    const track = document.getElementById('static-track');
    const dirLabel = document.getElementById('dirDisplay');
    const swapIcon = document.getElementById('swapIcon');
    if (!container || !track) return;

    const routeConfig = window.routeConfig[routeId];
    if (!routeConfig) return;

    let order = routeConfig.isSingleDirection ? routeConfig[0] : (currentDir === 0 ? routeConfig[0] : (routeConfig[1] || [...routeConfig[0]].reverse()));
    
    if (swapIcon) swapIcon.style.display = routeConfig.isSingleDirection ? 'none' : 'block';
    if (dirLabel) dirLabel.innerText = `${routeConfig.isCircularDirection ? '' : '往 '}${routeDest[currentDir]}`;

    const stations = order.map(id => window.stationConfig.find(s => String(s.id) === String(id))).filter(Boolean);
    
    container.innerHTML = stations.map((stn, index) => {
        const isFirst = index === 0;
        const isLast = index === stations.length - 1;
        const rowHeight = (isFirst || isLast) ? '60px' : '110px';
        const alignItems = isFirst ? 'flex-start' : (isLast ? 'flex-end' : 'center');
        const dotOffset = (isFirst || isLast) ? '25px' : '50%';
        const positionKey = isFirst ? 'top' : (isLast ? 'bottom' : 'top');

        return `
<div class="station-row" 
     data-stn-id="${stn.id}" 
     data-index="${index}" 
     data-total="${stations.length}" 
     style="position: relative; width: 100%; height: ${rowHeight}; display: flex; justify-content: center; align-items: ${alignItems}; z-index: 2; overflow: visible; box-sizing: border-box; ${isFirst ? 'padding-top: 25px;' : (isLast ? 'padding-bottom: 25px;' : '')}">
    
    <div style="position: absolute; left: 20px; display: flex; flex-direction: column; ${positionKey}: ${dotOffset}; transform: translateY(${isFirst ? '-50%' : (isLast ? '50%' : '-50%')});">
        <span style="font-size: 13px; font-weight: 800; color: var(--md-sys-color-on-surface); opacity: 0.8; line-height: 1.2;">
            ${stn.zh}
        </span>
        <span style="font-size: 10px; font-weight: 500; color: var(--md-sys-color-on-surface); opacity: 0.45; letter-spacing: 0.5px; margin-top: 1px;">
            ${stn.id}
        </span>
    </div>
    
    <div style="position: absolute; left: 30%; ${positionKey}: ${dotOffset}; transform: translate(-50%, ${isFirst ? '-50%' : (isLast ? '50%' : '-50%')}); width: 12px; height: 12px; background: white; border: 3px solid ${routeColor}; border-radius: 50%; z-index: 5; box-shadow: 0 0 0 4px var(--md-sys-color-surface-container-lowest);"></div>
    
    <div class="train-slot" style="position: absolute; left: calc(30% + 16px); ${positionKey}: ${dotOffset}; width: 185px; height: 0; display: flex; align-items: center; pointer-events: none; z-index: 10; overflow: visible;"></div>
</div>        `;
    }).join('');

    if (stations.length > 0) {
        const dotFromEdge = 25;
        const rowHeightShort = 60;
        const rowHeightLong = 110;
        track.style.top = `${dotFromEdge}px`;
        track.style.left = '30%';
        track.style.transform = 'translateX(-50%)';
        const totalHeight = (stations.length > 1) ? (rowHeightShort * 2 + (stations.length - 2) * rowHeightLong) : rowHeightShort;
        track.style.height = `${totalHeight - (dotFromEdge * 2)}px`;
    }
    
    updateTrains();
};

const updateTrains = async () => {
    const liveData = await getRunOnlyMap();
    const specialCfg = window.specialTrainsConfig || {};
    const rows = Array.from(document.querySelectorAll('.station-row'));
    const banner = document.getElementById('service-status-banner');
    const bannerTextEl = document.getElementById('service-status-text');
    if (!rows.length) return;

    const targetDest = routeDest[currentDir]; 
    const oppDest = routeDest[currentDir === 0 ? 1 : 0];

    const fetchPromises = rows.map(row => {
        const stnId = row.getAttribute('data-stn-id');
        return fetch(`https://lrtapi.lightcatcube.com/api/schedule?station_id=${stnId}`)
            .then(r => r.json())
            .catch(() => null);
    });

    const allResults = await Promise.all(fetchPromises);
    const bestTrainsMap = new Map(); 

    rows.forEach((row, idx) => {
        const res = allResults[idx];
        if (!res || !res.platform_list) return;

        const stnId = row.getAttribute('data-stn-id');
        const rowIndex = parseInt(row.getAttribute('data-index'));
        const totalRows = parseInt(row.getAttribute('data-total'));

        res.platform_list.forEach(plat => {
            if (!plat.route_list) return;
            plat.route_list.forEach(rt => {
                if (String(rt.route_no) !== String(routeId)) return;

                const apiDest = rt.dest_ch || "";
                let shouldShow = false;
                if (rowIndex === 0) {
                    if (apiDest.includes(targetDest)) shouldShow = true;
                } else if (rowIndex === totalRows - 1) {
                    if (apiDest.includes(targetDest) || apiDest.includes(oppDest)) shouldShow = true;
                } else {
                    if (apiDest.includes(targetDest)) shouldShow = true;
                }
                if (!shouldShow) return;

                let raw = rt.trip_no ? String(rt.trip_no) : (rt.train_id !== "0" ? String(rt.train_id) : "");
                let runNoRaw = (raw && raw.length > 2) ? raw.substring(0, raw.length - 2) : (raw || "");
                const cleanRunNo = runNoRaw ? parseInt(runNoRaw, 10).toString() : "";

                let etaVal = 999;
                const timeCh = rt.time_ch || "";
                if (timeCh.includes('即將抵達') || timeCh.includes('抵達')) etaVal = 0;
                else if (timeCh.includes('離開') || timeCh === "-") etaVal = -1;
                else {
                    const m = timeCh.match(/\d+/);
                    if (m) etaVal = parseInt(m[0]);
                }

                const trackKey = cleanRunNo || `ID-${rt.train_id}`;
                const existing = bestTrainsMap.get(trackKey);
                if (!existing || etaVal < existing.etaVal) {
                    bestTrainsMap.set(trackKey, { rt, stnId, rowIndex, totalRows, runNoRaw, cleanRunNo, etaVal });
                }
            });
        });
    });

    // --- 根據有無列車及路線配置顯示橫幅 ---
    if (banner && bannerTextEl) {
        const isSpecial = routeConfigData && routeConfigData.isSpecialDeparture;
        const isSchoolHoliday = routeConfigData && routeConfigData.isSchoolHolidayAvailable;

        if (isSpecial) {
            banner.style.display = 'flex';
            
            // 判斷特定路綫與假期配置
            if (String(routeId) === '751P') {
                bannerTextEl.innerText = "本路綫只於平日繁忙時段按需求提供服務";
            } else if (!isSchoolHoliday) {
                bannerTextEl.innerText = "本路綫只於平日（學校假期除外）上午繁忙時段提供服務";
            } else {
                bannerTextEl.innerText = "本路綫只於平日及學校假期上午繁忙時段提供服務";
            }
            
            banner.style.background = (bestTrainsMap.size > 0) ? 'var(--md-sys-color-secondary-container)' : 'var(--md-sys-color-error-container)';
            banner.style.color = (bestTrainsMap.size > 0) ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-error-container)';
        } else {
            bannerTextEl.innerText = "是日列車服務尚未開始或已經終止";
            banner.style.display = (bestTrainsMap.size === 0) ? 'flex' : 'none';
            banner.style.background = 'var(--md-sys-color-error-container)';
            banner.style.color = 'var(--md-sys-color-on-error-container)';
        }
    }

    const stationHtmlBuffer = {};

    bestTrainsMap.forEach(train => {
        const { rt, stnId, rowIndex, totalRows, runNoRaw, cleanRunNo } = train;
        
        let firebaseId = (cleanRunNo && liveData.has(cleanRunNo)) ? liveData.get(cleanRunNo) : null;
        let fullId = firebaseId || (rt.train_id !== "0" ? String(rt.train_id) : "---");
        
        const isUnknown = (fullId === "---" || !fullId || fullId === "undefined");
        const displayFullId = isUnknown ? "暫無紀錄" : fullId;
        const trainLen = parseInt(rt.train_length || 1, 10);

        const trainKey = isUnknown ? `UNK-${cleanRunNo || '000'}-${trainLen}` : `FID-${fullId}`;

        let iconHtml = '';
        if (!isUnknown) {
            const carList = String(fullId).split(/[\+\-–]/).map(s => s.trim());
            iconHtml = carList.map(num => {
                const icon = window.getCarIcon ? window.getCarIcon(num, specialCfg) : "P1R.png";
                return `<img src="${icon}" style="height: 18px; object-fit: contain;">`;
            }).join('');
        } else {
            const icons = [];
            for (let i = 0; i < trainLen; i++) {
                const iconSrc = (i === 0) ? "P2.png" : "P2T.png";
                icons.push(`<img src="${iconSrc}" style="height: 18px; object-fit: contain;">`);
            }
            iconHtml = icons.join('');
        }

        const timeCh = rt.time_ch || "";
        const isApproaching = timeCh.includes('即將抵達') || timeCh.includes('抵達');
        const isAtStation = (timeCh === "-" || timeCh.includes('離開')) && !isApproaching;
        const offset = (!isAtStation && rowIndex !== 0 && rowIndex !== totalRows - 1) ? -55 : 0;

        const cardHtml = `
            <div class="jr-tag" data-tkey="${trainKey}" data-offset="${offset}" style="
                display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 7px 14px;
                background: white; border-radius: 12px;
                transform: translateY(${offset}px);
                transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.06);
                pointer-events: auto; min-width: 80px; width: fit-content; z-index: 10;
                animation: tagFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            ">
                <div style="display: flex; align-items: center; justify-content: center; gap: 5px; width: 100%;">
                    <span style="font-size: 10.5px; font-weight: 900; color: ${routeColor}; letter-spacing: -0.3px;">
                        ${runNoRaw ? String(runNoRaw).padStart(3,'0') : '---'}
                    </span>
                    <div style="display: flex; gap: 2px; align-items: center;">${iconHtml}</div>
                </div>
                <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                    <span style="
                        font-size: ${isUnknown ? '11.5px' : '13.5px'}; 
                        font-weight: ${isUnknown ? '500' : '900'}; 
                        color: ${isUnknown ? '#44474e' : '#1c1b1f'}; 
                        letter-spacing: -0.2px;
                    ">
                        ${displayFullId}
                    </span>
                </div>
            </div>
        `.replace(/>\s+</g, '><').trim();

        if (!stationHtmlBuffer[stnId]) stationHtmlBuffer[stnId] = '';
        stationHtmlBuffer[stnId] += cardHtml;
    });

    rows.forEach(row => {
        const stnId = row.getAttribute('data-stn-id');
        const slot = row.querySelector('.train-slot');
        const newHtml = stationHtmlBuffer[stnId] || '';
        if (slot.innerHTML !== newHtml) {
            slot.innerHTML = newHtml;
        }
    });
};

        renderStationList();
        if (window.routeDetailTimer) clearInterval(window.routeDetailTimer);
        window.routeDetailTimer = setInterval(updateTrains, 10000);

        contentArea.classList.remove('page-exit');
        contentArea.classList.add('page-enter');
        requestAnimationFrame(() => contentArea.classList.remove('page-enter'));
    }, 250);
};