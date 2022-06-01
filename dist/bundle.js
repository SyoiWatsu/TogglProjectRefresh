/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/consts.ts":
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SHEET_CONSTS": () => (/* binding */ SHEET_CONSTS),
/* harmony export */   "TOGGL_CONSTS": () => (/* binding */ TOGGL_CONSTS)
/* harmony export */ });
const TOGGL_CONSTS = {
    BASE_URL: 'https://api.track.toggl.com/api/v8',
};
const SHEET_CONSTS = {
    TOGGL_PROJECTS_CONFIG: {
        SSID: '1BIJCgF2ZZMDMLAUp22HYteJdl6oyQzm0K7rurp8qLr0',
        TABS: {
            USERS: 'users',
            CLIENTS: 'clients',
        },
        NAMED_RANGE: {
            USERS_KEYS: 'USERS_KEYS',
            DONES: 'DONE',
        },
    }
};


/***/ }),

/***/ "./src/operations/index.ts":
/*!*********************************!*\
  !*** ./src/operations/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _refresh_clients__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./refresh_clients */ "./src/operations/refresh_clients.ts");
/* harmony import */ var _refresh_projects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./refresh_projects */ "./src/operations/refresh_projects.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    refreshClients: _refresh_clients__WEBPACK_IMPORTED_MODULE_0__["default"],
    refreshProjects: _refresh_projects__WEBPACK_IMPORTED_MODULE_1__["default"],
});


/***/ }),

/***/ "./src/operations/refresh_clients.ts":
/*!*******************************************!*\
  !*** ./src/operations/refresh_clients.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var toggl_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! toggl_api */ "./src/toggl_api/index.ts");
/* harmony import */ var consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! consts */ "./src/consts.ts");
/* harmony import */ var sheets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sheets */ "./src/sheets.ts");
/* harmony import */ var sheet_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sheet_data */ "./src/sheet_data/index.ts");
/* harmony import */ var store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! store */ "./src/store.ts");





const refreshClients = () => {
    const activeUsers = sheet_data__WEBPACK_IMPORTED_MODULE_3__["default"].users.filter(user => user.status == 'active' && !user.done);
    const clients = sheet_data__WEBPACK_IMPORTED_MODULE_3__["default"].clients;
    let count = 0; //仮
    for (let user of activeUsers) {
        if (user.done)
            continue;
        count++; //仮
        if (count > 3)
            break; //仮
        console.log('Target user : ', user.administrator);
        store__WEBPACK_IMPORTED_MODULE_4__.ApiToken.set(user.apiToken);
        deleteClients(user);
        createClients(clients, user);
        markAsDone(user);
    }
};
// 引数に渡されたユーザーの Client を全て削除
const deleteClients = (user) => {
    const clients = toggl_api__WEBPACK_IMPORTED_MODULE_0__["default"].workspaces.clients.get({ workspaceId: user.workspaceId }).body;
    for (let client of clients) {
        try {
            toggl_api__WEBPACK_IMPORTED_MODULE_0__["default"].clients["delete"]({ clientId: client.id });
            console.log('deleted: ', client.name);
        }
        catch (error) {
            console.warn('⚠️ Catched error when deleting : ', client);
            console.warn(error);
        }
        finally {
            // API の呼び出し制限回避のため 1秒 待つ
            Utilities.sleep(1000);
        }
    }
};
// 引数に渡されたユーザーの Client を新規作成
const createClients = (clients, user) => {
    for (let client of clients) {
        try {
            const res = toggl_api__WEBPACK_IMPORTED_MODULE_0__["default"].clients.create({
                name: client,
                workspaceId: user.workspaceId,
            });
            console.log('created :', res.body);
        }
        catch (error) {
            console.warn('⚠️ Catched error when creating: ', client);
            console.warn(error);
        }
        finally {
            // API の呼び出し制限回避のため 1秒 待つ
            Utilities.sleep(1000);
        }
    }
};
// 引数に渡されたユーザーの done 列にチェック
const markAsDone = (user) => {
    var _a;
    const index = sheet_data__WEBPACK_IMPORTED_MODULE_3__["default"].users.findIndex(u => u.apiToken == user.apiToken);
    if (index < 0) {
        console.warn('No match index for', user);
        return;
    }
    (_a = sheets__WEBPACK_IMPORTED_MODULE_2__.TogglProjectsConfigSheet.getSheetByName(consts__WEBPACK_IMPORTED_MODULE_1__.SHEET_CONSTS.TOGGL_PROJECTS_CONFIG.TABS.USERS)) === null || _a === void 0 ? void 0 : _a.getRange(`G${index + 2}`).setValue(true);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (refreshClients);


/***/ }),

/***/ "./src/operations/refresh_projects.ts":
/*!********************************************!*\
  !*** ./src/operations/refresh_projects.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var toggl_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! toggl_api */ "./src/toggl_api/index.ts");
/* harmony import */ var sheet_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sheet_data */ "./src/sheet_data/index.ts");
/* harmony import */ var store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! store */ "./src/store.ts");



const refreshProjects = () => {
    const activeUsers = sheet_data__WEBPACK_IMPORTED_MODULE_1__["default"].users.filter(user => user.status == 'active' && !user.done);
    const clients = sheet_data__WEBPACK_IMPORTED_MODULE_1__["default"].clients;
    let count = 0; //仮
    for (let user of activeUsers) {
        if (user.done)
            continue;
        count++; //仮
        if (count > 3)
            break; //仮
        console.log('Target user : ', user.administrator);
        store__WEBPACK_IMPORTED_MODULE_2__.ApiToken.set(user.apiToken);
        deleteProjects(user); //できた！
        // 作りたい project の一覧を作る
        // {name, wid, cid} の配列
        // 　↓
        // 作る 
    }
};
// 引数に渡されたユーザーの Project を全て削除
const deleteProjects = (user) => {
    const projects = toggl_api__WEBPACK_IMPORTED_MODULE_0__["default"].workspaces.projects.get({ workspaceId: user.workspaceId }).body || [];
    if (!projects.length) {
        console.warn('No projects ...');
        return;
    }
    for (let project of projects) {
        try {
            toggl_api__WEBPACK_IMPORTED_MODULE_0__["default"].projects["delete"]({ projectId: project.id });
            console.log('deleted: ', project);
        }
        catch (error) {
            console.warn('⚠️ Catched error when deleting : ', project);
            console.warn(error);
        }
        finally {
            // API の呼び出し制限回避のため 1秒 待つ
            Utilities.sleep(1000);
        }
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (refreshProjects);


/***/ }),

/***/ "./src/sheet_data/clients.ts":
/*!***********************************!*\
  !*** ./src/sheet_data/clients.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! consts */ "./src/consts.ts");
/* harmony import */ var sheets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sheets */ "./src/sheets.ts");


const clientsSheet = sheets__WEBPACK_IMPORTED_MODULE_1__.TogglProjectsConfigSheet.getSheetByName(consts__WEBPACK_IMPORTED_MODULE_0__.SHEET_CONSTS.TOGGL_PROJECTS_CONFIG.TABS.CLIENTS);
const clients = (clientsSheet === null || clientsSheet === void 0 ? void 0 : clientsSheet.getDataRange().getValues().flat().slice(1)) || [];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clients);


/***/ }),

/***/ "./src/sheet_data/index.ts":
/*!*********************************!*\
  !*** ./src/sheet_data/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _users__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./users */ "./src/sheet_data/users.ts");
/* harmony import */ var _clients__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clients */ "./src/sheet_data/clients.ts");
/* harmony import */ var _projects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./projects */ "./src/sheet_data/projects.ts");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    users: _users__WEBPACK_IMPORTED_MODULE_0__["default"],
    clients: _clients__WEBPACK_IMPORTED_MODULE_1__["default"],
    projects: _projects__WEBPACK_IMPORTED_MODULE_2__["default"],
});


/***/ }),

/***/ "./src/sheet_data/projects.ts":
/*!************************************!*\
  !*** ./src/sheet_data/projects.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// 色々 projects を取得してくる処理
const projects = {};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (projects);


/***/ }),

/***/ "./src/sheet_data/users.ts":
/*!*********************************!*\
  !*** ./src/sheet_data/users.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! consts */ "./src/consts.ts");
/* harmony import */ var sheets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sheets */ "./src/sheets.ts");


const usersSheet = sheets__WEBPACK_IMPORTED_MODULE_1__.TogglProjectsConfigSheet.getSheetByName(consts__WEBPACK_IMPORTED_MODULE_0__.SHEET_CONSTS.TOGGL_PROJECTS_CONFIG.TABS.USERS);
let users = (usersSheet === null || usersSheet === void 0 ? void 0 : usersSheet.getDataRange().getValues().slice(1).filter(row => row[0]).map(row => {
    const user = {
        administrator: row[0],
        apiToken: row[1],
        userAgent: row[2],
        workspaceId: row[3],
        status: row[4],
        done: row[6],
    };
    return user;
})) || [];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (users);


/***/ }),

/***/ "./src/sheets.ts":
/*!***********************!*\
  !*** ./src/sheets.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TogglProjectsConfigSheet": () => (/* binding */ TogglProjectsConfigSheet)
/* harmony export */ });
/* harmony import */ var consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! consts */ "./src/consts.ts");

const TogglProjectsConfigSheet = SpreadsheetApp.openById(consts__WEBPACK_IMPORTED_MODULE_0__.SHEET_CONSTS.TOGGL_PROJECTS_CONFIG.SSID);


/***/ }),

/***/ "./src/store.ts":
/*!**********************!*\
  !*** ./src/store.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApiToken": () => (/* binding */ ApiToken)
/* harmony export */ });
let _apiToken = '';
const ApiToken = {
    get: () => _apiToken,
    set: (value) => {
        _apiToken = value;
        return _apiToken;
    },
};
Object.freeze(ApiToken);



/***/ }),

/***/ "./src/toggl_api/clients.ts":
/*!**********************************!*\
  !*** ./src/toggl_api/clients.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./request */ "./src/toggl_api/request.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    // 動作確認済み！
    create: ({ name, workspaceId }) => {
        const path = `clients`;
        const payload = {
            client: {
                name,
                wid: workspaceId,
            },
        };
        return _request__WEBPACK_IMPORTED_MODULE_0__["default"].post({ path, payload });
    },
    // 動作確認済み！
    delete: ({ clientId }) => {
        const path = `clients/${clientId}`;
        return _request__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"]({ path });
    },
});


/***/ }),

/***/ "./src/toggl_api/index.ts":
/*!********************************!*\
  !*** ./src/toggl_api/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _workspaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./workspaces */ "./src/toggl_api/workspaces.ts");
/* harmony import */ var _clients__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clients */ "./src/toggl_api/clients.ts");
/* harmony import */ var _projects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./projects */ "./src/toggl_api/projects.ts");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    workspaces: _workspaces__WEBPACK_IMPORTED_MODULE_0__["default"],
    clients: _clients__WEBPACK_IMPORTED_MODULE_1__["default"],
    projects: _projects__WEBPACK_IMPORTED_MODULE_2__["default"],
});


/***/ }),

/***/ "./src/toggl_api/projects.ts":
/*!***********************************!*\
  !*** ./src/toggl_api/projects.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./request */ "./src/toggl_api/request.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    // 動作確認済み！
    create: ({ name, workspaceId, clientId }) => {
        const path = `projects`;
        const payload = {
            project: {
                name,
                wid: workspaceId,
                cid: clientId,
            },
        };
        return _request__WEBPACK_IMPORTED_MODULE_0__["default"].post({ path, payload });
    },
    // 動作確認済み！
    delete: ({ projectId }) => {
        const path = `projects/${projectId}`;
        return _request__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"]({ path });
    },
});


/***/ }),

/***/ "./src/toggl_api/request.ts":
/*!**********************************!*\
  !*** ./src/toggl_api/request.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _serializer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./serializer */ "./src/toggl_api/serializer.ts");
/* harmony import */ var consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! consts */ "./src/consts.ts");
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils */ "./src/utils.ts");
/* harmony import */ var store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! store */ "./src/store.ts");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    // TODO: parameters を受け取って url のお尻にいい感じにくっつけられるように
    get: ({ path, params }) => {
        const url = (0,utils__WEBPACK_IMPORTED_MODULE_2__.getUrl)(consts__WEBPACK_IMPORTED_MODULE_1__.TOGGL_CONSTS.BASE_URL, path);
        const headers = {
            "Authorization": "Basic " + Utilities.base64Encode(store__WEBPACK_IMPORTED_MODULE_3__.ApiToken.get() + ":" + "api_token"),
        };
        const res = UrlFetchApp.fetch(url, {
            method: "get",
            headers: headers,
            // muteHttpExceptions: false,
        });
        return (0,_serializer__WEBPACK_IMPORTED_MODULE_0__["default"])({ res });
    },
    post: ({ path, payload }) => {
        const url = (0,utils__WEBPACK_IMPORTED_MODULE_2__.getUrl)(consts__WEBPACK_IMPORTED_MODULE_1__.TOGGL_CONSTS.BASE_URL, path);
        const headers = {
            "Authorization": "Basic " + Utilities.base64Encode(store__WEBPACK_IMPORTED_MODULE_3__.ApiToken.get() + ":" + "api_token"),
        };
        const res = UrlFetchApp.fetch(url, {
            method: "post",
            headers: headers,
            contentType: "application/json",
            payload: JSON.stringify(payload),
        });
        return (0,_serializer__WEBPACK_IMPORTED_MODULE_0__["default"])({ res });
    },
    delete: ({ path, payload }) => {
        const url = (0,utils__WEBPACK_IMPORTED_MODULE_2__.getUrl)(consts__WEBPACK_IMPORTED_MODULE_1__.TOGGL_CONSTS.BASE_URL, path);
        const headers = {
            "Authorization": "Basic " + Utilities.base64Encode(store__WEBPACK_IMPORTED_MODULE_3__.ApiToken.get() + ":" + "api_token"),
        };
        const res = UrlFetchApp.fetch(url, {
            method: "delete",
            headers: headers,
            contentType: "application/json",
            payload: JSON.stringify(payload),
        });
        return (0,_serializer__WEBPACK_IMPORTED_MODULE_0__["default"])({ res });
    },
});


/***/ }),

/***/ "./src/toggl_api/serializer.ts":
/*!*************************************!*\
  !*** ./src/toggl_api/serializer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const serializer = ({ res }) => {
    const status = res.getResponseCode();
    const body = JSON.parse(res.getContentText('utf-8'));
    return { status, body };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (serializer);


/***/ }),

/***/ "./src/toggl_api/workspaces.ts":
/*!*************************************!*\
  !*** ./src/toggl_api/workspaces.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./request */ "./src/toggl_api/request.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    clients: {
        // 動作確認済み！
        get: ({ workspaceId }) => {
            const path = `workspaces/${workspaceId}/clients`;
            return _request__WEBPACK_IMPORTED_MODULE_0__["default"].get({
                path: path,
            });
        },
    },
    projects: {
        // 動作確認済み！
        get: ({ workspaceId }) => {
            const path = `workspaces/${workspaceId}/projects`;
            return _request__WEBPACK_IMPORTED_MODULE_0__["default"].get({
                path: path,
            });
        },
    },
});


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUrl": () => (/* binding */ getUrl),
/* harmony export */   "printMsg": () => (/* binding */ printMsg)
/* harmony export */ });
const printMsg = (msg) => {
    console.log({ msg });
};
const getUrl = (...arg) => arg.join('/');


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var operations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! operations */ "./src/operations/index.ts");

__webpack_require__.g.TEST = () => {
    const workspaceId = 4747380;
    // const res = TogglApi.workspaces.projects.get({workspaceId});
    // console.log(res);
    // 動作確認済み
    // Operetions.refreshClients();
    // まだ delete しかできない
    operations__WEBPACK_IMPORTED_MODULE_0__["default"].refreshProjects();
    // const clientId = 50332645;
    // const name = 'ぐぴぴぴぴぴっぴいっぴぴ！！';
    // const res = TogglApi.projects.create({ name, workspaceId, clientId });
    // console.log(res);
    // const projectId = 169401675;
    // const res = TogglApi.projects.delete({projectId});
    // console.log(res);
};

})();

/******/ })()
;