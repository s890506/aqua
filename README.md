# Aqua 開發教學

## 背景知識
* [mongo-models API 說明文件](https://github.com/jedireza/mongo-models/blob/master/API.md#findoneandupdatefilter-options-callback)
* [Async 使用範例](https://github.com/bsspirit/async_demo)

## 新增 API

1. 於 manifest.js 的 registrations 中註冊 API 資訊。

```javascript
        {
            plugin: './server/api/post', // code 路徑
            options: {
                routes: { prefix: '/api' } //api 前置路徑
            }
        },
```

2. 於 `/server/api/` 路徑中新增 code 檔案。簡易的 CRUD 範例[請參考此檔案](https://github.com/s890506/aqua/blob/master/server/api/post.js)。


## 解決 API 403 forbidden 訊息

於 manifest.js 中註解掉下列程式碼。詳細原因請參考此[說明文件](https://github.com/jedireza/aqua/wiki/HTTP-403-forbidden-when-accessing-API-endpoints)。
```javascript
          {
             plugin: {
                 register: 'crumb',
                 options: {
                     restful: false
                 }
             }
         },
```
