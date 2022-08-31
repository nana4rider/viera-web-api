# viera-web-api

VIERA Unofficial Web API

## VIERAとのペアリング方法(appIdとencKeyの取得)

### デバイスを登録する
https://nana4rider.github.io/viera-web-api/#/device/DeviceController_create

### PINコードを画面に表示する
https://nana4rider.github.io/viera-web-api/#/auth/DeviceAuthController_displayPinCode

### PINコードを認証する
https://nana4rider.github.io/viera-web-api/#/auth/DeviceAuthController_auth

## APIドキュメント

https://nana4rider.github.io/viera-web-api/

## データベース構成の変更
```
npm run typeorm:generate-migration ./src/migration/[name]
npm run typeorm:run-migrations
```
