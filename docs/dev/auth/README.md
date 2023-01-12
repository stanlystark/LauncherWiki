# Своя реализация OAuth

[[toc]]

OAuth в лаунчере позволяет использовать временные токены доступа(access) вместо устаревшей системы сессий. Этот метод
отлично подойдет для интеграции собственных CMS с лаунчером

Для работы с OAuth вам необходимо реализовать соответствующие методы getUserSessionByOAuthAccessToken,
refreshAccessToken, а в методе authorize вернуть результат с данными OAuth

Вы можете написать свой скрипт авторизации, для того что бы производить авторизацию через ваше API. Это позволит делать
проверки любой сложности и адаптировать авторизацию лаунчера под любой сайт.

Настройте тип авторизации `http`

## Порядок авторизации с OAuth

- Первым шагом вызывается getAuthDetails (Если используется), который сообщает все возможные факторы авторизации
- Вторым шагом выполняется авторизация с помощью метода authorize. Вы должны:
  - Проверить, аргументы login и password на null и тип
  - Если context равен null то это означает, что вам не требуется проверять пароль(если это возможно). Это позволяет
    администратору с помощью команды 'sendAuth' авторизировать пользователя без пароля. Вы вправе не поддерживать
    данный режим работы и всегда требовать пароль
  - Создайте объект UserSession, содержащий информацию о пользователе, а так же токены accessToken и refreshToken при
    необходимости
- Авторизация завершена

При необходимости пользователю обновить свой истекший accessToken будет вызван метод refreshAccessToken. В нем вы должны
обновить accessToken  **и refreshToken(если это возможно)**  и вернуть их пользователю. Выставление параметра expire в 0
делает токен вечным

При повторной авторизации вызывается метод getUserByTokenUrl, который должен вернуть объект UserSession с находящимся
внутри объектом HttpUser

## Авторизация приложения

HttpAuthCore будет выполнять `Bearer` авторизацию со всеми методами. Это значит, что с каждым запросом будет отправлен
дополнительный заголовок:

`Authorization: Bearer {token}`

`token` - токен из поля `bearerToken` в конфиге.

Для обеспечения безопасности, вы должны также сохранить этот токен у себя на удалённом сервере и сверять этот заголовок,
при любом запросе.

UDP: метод `getUserByTokenUrl` работает сейчас немного иначе. Заголовок будет отправлен, однако вместо токена, там будет
лежать `accessToken`. Что-то вроде `Authorization: Bearer {accessToken}`. Учитывайте это, при построении систем.

## Список методов

Ниже приведены все методы, которые обрабатывает HttpAuthCoreProvider

1. GET `getUserByUsernameUrl`
2. GET `getUserByLoginUrl`
3. GET `getUserByUUIDUrl`
4. GET `getUserByTokenUrl`
5. GET `getAuthDetailsUrl` (В конфиге этот метод называется `getAuthDetails`, будет исправлено в будущем)
6. POST `authorizeUrl`
7. POST `refreshTokenUrl`
8. POST `updateServerIdUrl`
9. POST `joinServerUrl`
10. POST `checkServerUrl`

Из последних 3-х методов вам необходимо реализовать либо `updateServerIdUrl`, либо `joinServerUrl` и `checkServerUrl`

Пример рекомендованного конфига, реализующего OAuth:
```json
{
  "getUserByUsernameUrl": "https://example.com/user/name/%username%",
  "getUserByLoginUrl": "https://example.com/user/login/%login%",
  "getUserByUUIDUrl": "https://example.com/user/uuid/%uuid%",
  "getUserByTokenUrl": "https://example.com/auth/current",
  "getAuthDetailsUrl": "https://example.com/auth/details",
  "refreshTokenUrl": "https://example.com/auth/refresh",
  "authorizeUrl": "https://example.com/auth/authorize",
  "joinServerUrl": "https://example.com/auth/joinServer",
  "checkServerUrl": "https://example.com/auth/checkServer",
  "bearerToken": "TOKEN",
  "type": "http"
}
```

Успешный ответ предполагает код 200 и тело в виде JSON.

## Обработка ошибок

Вы можете возвращать некоторые ошибки. Все ошибки лаунчер ожидает в виде JSON ответа:

```json lines
{
  "error": "тип ошибки (ниже)"
}
```

Список типов, которые вы можете вернуть:

- `auth.require2fa` - вызывается, если нужно проверить второй фактор
- `auth.require.factor.{number}` - вызывается, при использовании MFA для указания необходимости фактора по номеру
- `auth.expiretoken` - вызывается, если токен авторизации истёк (Приведёт к выполнению `refreshTokenUrl` для получения
  нового токена)
- `auth.invalidtoken` - вызывается, если токен неверный
- `auth.usernotfound` - вызывается, если вы не нашли пользователя (Так же необходимо вернуть код 404)
- `auth.wrongpassword` - вызывается, если пользователь ввёл неверный пароль
- `auth.userblocked` - вызывается, если пользователь заблокирован в вашей системе

## Основные объекты

Список объектов, которые будут возвращать методы:

### HttpUser
```json:no-line-numbers
{
  "username": "Gravita",
  "uuid": "UUID",
  "accessToken": "accessToken авторизации",
  "permissions": {
    "perms": [
      "launchserver.*",
      "launcher.*"
    ],
    "roles": [
      "ADMIN"
    ]
  },
  "assets": {
    "SKIN": {
      "url": "https://example.com/skins/Gravita.png",
      "digest": "", // base64(md5(Bytes))
      "metadata": { // Ничего, если скин типа стив
        "model": "slim"
      }
    },
    "CAPE": { // Ничего, если не используется
      "url": "https://example.com/capes/Gravita.png",
      "digest": ""
    }
  },
  "properties": {
    "key": "value"
  }
}
```
::: tip Properties

Properties - **публичные** параметры, ассоциированные с игроком(например параметры персонажа, выставляемые в личном кабинете). Получить их в моде/плагине можно из объекта ```GameProfile``` authlib. Вы не должны передавать ```textures``` как properties, так как это нарушит правильную работу скинов и плащей. Для работы properties требуется обновление authlib на стороне клиента и сервера

:::


### HttpUserSession
```json:no-line-numbers
{
  "id": "RANDOM ID", // ID сессии в вашей системе, либо случайная строка или число, если такой системы нет
  "user": HttpUser, // Объект HttpUser
  "expireIn": 0 // Срок окончания действия сессии, 0 - если сессия вечная. Не используется
}
```

### AuthReport
```json:no-line-numbers
{
  "minecraftAccessToken": "MINECRAFT ACCESS TOKEN", // При желании, может совпадать с "oauthAccessToken"
  "oauthAccessToken": "ACCESS TOKEN",
  "oauthRefreshToken": "REFRESH TOKEN",
  "oauthExpire": 0, // Длительность действия accessToken в мс, 0 - если токен будет вечным (В таком случае метод refreshToken не будет вызван)
  "session": HttpUserSession // Объект
}
```

## Основные сведения о методах

Методы `getUserByUsernameUrl`, `getUserByLoginUrl`, `getUserByUUIDUrl`, `checkServerUrl` ожидают ответ типа [HttpUser](#httpuser), а данные получают в виде GET параметров

Метод `getUserByTokenUrl` ожидает ответ типа [HttpUserSession](#httpusersession)

Методы `authorizeUrl`, `refreshTokenUrl` ожидают ответ типа [AuthReport](#authreport)

Методы `joinServerUrl`,`updateServerIdUrl` ожидают ответ **200** в случае успеха


## Методы
### Метод `authorizeUrl`

Метод вызывается при авторизации пользователя. Тут вы должны проверить логин, пароль.

Запрос:
```json:no-line-numbers
{
  "login": "Gravita",
  "context": {
    "ip": "127.0.0.1"
  },
  "password": {
    "password": "qwerty",
    "type": "plain"
  },
  "minecraftAccess": true //если false, то в AuthReport возвращать minecraftAccessToken не требуется
}
```

Ответ: [AuthReport](#authreport)

::: tip Подсказка
Если "context" равно null, вы можете не делать проверку на факторы и сразу разрешить авторизацию. Тогда вы позволите
авторизировать пользователей через консольную команду. Вы в праве не делать этого, если не хотите.
:::

### Метод `refreshTokenUrl`

В этом методе вы должны обновить accessToken, если используете не вечные токены. Если ваши токены вечные, вы можете не
реализовывать данный метод

Запрос:
```json:no-line-numbers
{
  "refreshToken": "REFRESH TOKEN",
  "context": {
    "ip": "127.0.0.1"
  }
}
```
Ответ: [AuthReport](#authreport)

### Метод `joinServerUrl`

Используется, когда пользователь заходит на сервер. Вы должны присвоить serverId пользователю в вашей системе, а позже, в
методе checkServer сверить serverId.

Запрос:
```json:no-line-numbers
{
  "username": "Gravita",
  "accessToken": "MINECRAFT ACCESS TOKEN",
  "serverId": "SERVER ID"
}
```
Ответ: любой JSON с кодом **200**

### Метод `checkServerUrl`

В этом методе вы должны проверить serverId с тем что лежит в базе (Было положено в `joinServerUrl`)

Запрос:
```json:no-line-numbers
{
  "username": "Gravita",
  "serverId": "SERVER ID"
}
```
Ответ: [HttpUser](#httpuser)

### Метод `updateServerIdUrl`

В этом методе вы должны присвоить пользователю полученный serverId

Запрос:
```json:no-line-numbers
{
  "username": "Gravita",
  "serverId": "SERVER ID"
}
```
Ответ: любой JSON с кодом **200**

### Метод `getAuthDetailsUrl`

Необязательный метод, который используется для указания всех возможных способов авторизации. Используется, только при
реализации 2FA \ MFA

Ответ:
```json:no-line-numbers
{
  "details": [
    {
      "type": "password"
    },
    {
      "type": "totp"
    }
  ]
}
```

## Подключение 2FA

Вы можете реализовать 2FA.
Для начала постройте всю авторизацию без него, после чего обязательно реализуйте метод `getAuthDetailsUrl`

Когда `authorizeUrl` вызывается впервые, вы должны проверить, есть ли у пользователя подключённый 2FA. И, если подключён, вернуть ошибку "auth.require2fa". Обратите внимание, вы должны вернуть эту ошибку после того как пароль пользователя уже прошёл проверку.

Когда вы вернёте необходимость 2FA, пользователю будет предложено ввести второй фактор. Следом метод `authorizeUrl` будет вызван ещё раз, однако запрос будет выглядеть немного иначе:

```json:no-line-numbers
{
  "login": "Gravita",
  "context": {
    "ip": "127.0.0.1"
  },
  "password": {
    "firstPassword": {
      "password": "qwerty",
      "type": "plain"
    },
    "secondPassword": {
      "totp": "110011",
      "type": "totp"
    }
  },
  "minecraftAccess": true
}
```

Вам будет необходимо повторно проверить правильность пароля, а так же правильность введённого кода 2FA ("totp")

Good luck ❤!
