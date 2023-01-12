# Дополнительно

## Кастомные serverButton
Вы можете использовать под каждый профиль, собственные ```serverButton```.

Для этого, в папке ```components``` создайте папку ```serverButton``` (регистр важен)

Cкопируйте туда файл ```serverButton.fxml```, переименовав его в ```PROFILE_UUID.fxml```,

где ```PROFILE_UUID``` - ```UUID``` вашего профиля, для которого вы делаете ```serverButton```

::: warning Обратите внимание:
Так как папка теперь не ```components```, а ```components/serverButton```, в вашем fxml, необходимо изменить пути
к некоторым файлам/папкам:
:::

```"@../../images/servers/example.png"``` вместо ```"@../images/servers/example.png"```

(где ```example.png``` - изображение на ```serverButton```)

```"@../components.css"``` вместо ```"@components.css"```

```"@../../styles/global.css"``` вместо ```"@../styles/global.css"```

```"@../../styles/variables.css"``` вместо ```"@../styles/variables.css"```

## ProfileWhitelist профиля клиента
Позволяет скрыть клиент от всех пользователей, кроме записаных в profileWhitelist

В профиле клиента установите `"limited": true,`

В конфиге `LaunchServer.json`:
- `"protectHandler": {`
  - `"profileWhitelist": {"TITLE ПРОФИЛЯ": ["Ник1", "Ник2"]},`
