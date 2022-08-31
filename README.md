# viera-web-api

VIERA Unofficial Web API

## VIERAとのペアリング方法(appIdとencKeyの取得)

https://github.com/nana4rider/panasonic-viera-ts

## APIドキュメント

https://nana4rider.github.io/viera-web-api/

## データベース構成の変更
```
npm run typeorm:generate-migration ./src/migration/[name]
npm run typeorm:run-migrations
```
