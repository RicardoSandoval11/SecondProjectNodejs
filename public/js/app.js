/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\ndocument.addEventListener('DOMContentLoaded', () => {\r\n    const removeBtns = document.querySelectorAll('.remove-btn');\r\n\r\n    const boxDialog = document.querySelector('#box-dialog');\r\n    const boxDialogTitle = document.querySelector('#box-dialog-title');\r\n    const boxDialogContent = document.querySelector('#box-dialog-content');\r\n    const closeDialogBtn = document.querySelector('#close-btn');\r\n    const body = document.querySelector('#bg-dark');\r\n    // remove article\r\n    const removeArticleForm = document.querySelector('.remove-article-form');\r\n\r\n    const openDialog = (event) => {\r\n\r\n        const articleinformation = event.target.id.split('_');\r\n        boxDialogTitle.innerHTML = `Remove article ${articleinformation[0]}`;\r\n        boxDialogContent.innerHTML = `Once you have deleted the article '${articleinformation[0]}', you will not be able to get it back.`\r\n        removeArticleForm.id = articleinformation[1];\r\n        boxDialog.classList.add('animate__fadeIn');\r\n        boxDialog.classList.remove('hidden');\r\n        body.classList.remove('hidden');\r\n\r\n    }\r\n\r\n    removeBtns.forEach((btn) => {\r\n        btn.addEventListener('click', openDialog);\r\n    });\r\n\r\n    const handleCloseBoxDialog = () => {\r\n        boxDialog.classList.add('hidden');\r\n        body.classList.add('hidden');\r\n    }\r\n\r\n    closeDialogBtn.addEventListener('click', handleCloseBoxDialog);\r\n\r\n    const removeArticle = (event) => {\r\n        const action = `/articles/remove/${event.target.id}`;\r\n        removeArticleForm.setAttribute('action', action);\r\n    }\r\n\r\n    removeArticleForm.addEventListener('submit', removeArticle);\r\n\r\n});\n\n//# sourceURL=webpack://proyecto2-nodejs/./src/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/app.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;