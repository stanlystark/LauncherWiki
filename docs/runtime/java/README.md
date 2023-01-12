# Скачивание своей Java

-   Скачайте  **архивы**  с JRE/JDK с [Adoptium](https://adoptium.net/) или другого поставщика сборок OpenJDK
-   Распакуйте архивы в папку updates и дайте им понятные названия: ```java17-windows-x86-64```, ```java17-windows-x86``` и т.д.
-   По желанию удалите из сборок JRE/JDK необязательные компоненты для уменьшения объема скачиваемых данных
-   Откройте файл ```config/JavaRuntime/Config.json``` в текстовом редакторе, найдите строку **"javaList": {}** и приведите её к такому виду:

```json
  "javaList": {
    "java17-windows-x86-64": "Java 17 b53 mustdie X86_64 javafx true",
    "java17-windows-x86": "Java 17 b53 mustdie X86 javafx true"
  },
```

::: warning Формат записи:
```
Java {номер версии} b{номер сборки} {mustdie (это windows)/linux/macosx} {архитектура} javafx {наличие javafx}
```
Архитектуры:
- X86_64 (Intel/AMD 64 бит)
- X86 (Intel/AMD 32 бит)
- ARM32 (32 разрядные ARM)
- ARM64 (64 разрядные ARM)
:::

-   Добавьте названия ваших папок с JRE/JDK в **"protectHandler": {}** конфигурации лаунчсервера LaunchServer.json
```json
    "allowUpdates": ["java17-windows-64", "java17-windows-32"],
```
-   Выполните ```syncup``` и ```build```
-   Проверьте правильность работы