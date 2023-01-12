# Установка

[[toc]]

## LaunchServer

### Linux

Перейдите в пользователя **launcher**:

```bash
su - launcher
```
Выполнить установку **LaunchServer**'a скриптом:

```bash
wget -O - https://mirror.gravitlauncher.com/scripts/setup-master.sh | bash <(cat) </dev/tty
```
**После завершения установки запустите лаунчсервер для начальной настройки:**
```bash
./start.sh
```
-   Укажите ваш ДОМЕН или IP, на котором будет работать лаунчсервер
-   Укажите название вашего проекта, которое будет отображаться в лаунчере и в папке AppData
-   После первого запуска закройте лаунчсервер командой **stop**

```bash
stop
```
:::: details Описание папок и файлов установленных скриптом
::: tip Список папок SRC и git:
-   **src/**  - исходный код лаунчсервера, API, модулей, лаунчера
-   **srcRuntime/**  - исходный код графической части лаунчера (рантайм)
-   **compat/**  - дополнительные важные файлы: библиотека авторизации, ServerWrapper, модули для лаунчера и лаунчсервера и т.д.
    :::
    ::: tip Установщик так же собирает все модули, готовые модули можно найти по путям:
-   **src/modules/<НазваниеМодуля>_module/build/libs/<НазваниеМодуля>_module.jar** - собранный модуль для лаунчсервера.
-   **src/modules/<НазваниеМодуля>_lmodule/build/libs/<НазваниеМодуля>_lmodule.jar** - собранный модуль для лаунчера.
    :::
    ::: tip Готовые скрипты, созданные установщиком:
-   **./start.sh**  - запуск лаунчсервера для тестирования и начальной настройки
-   **./startscreen.sh**  - запуск лаунчсервера на постоянной основе с помощью утилиты screen. Не запускайте два лаунчсервера одновременно!
-   **./update.sh**  - обновляет лаунчсервер, лаунчер и рантайм до последней релизной версии
    :::
    ::: tip Список папок лаунчсервера:
-   **libraries/**  - библиотеки для лаунчсервера
-   **modules/**  - модули для лаунчсервера (оканчивающиеся на _module.jar)
-   **profiles/**  - папка профилей для запуска MineCraft
-   **updates/**  - папка обновлений
-   **logs/**  - папка с логами (журналом) лаунчсервера
-   **runtime/**  - папка с дизайном лаунчера
-   **launcher-modules/**  - модули для лаунчера (оканчивающиеся на _lmodule.jar)
-   **launcher-libraries/**  - библиотеки для лаунчера
-   **launcher-compile-libraries/**  - вспомогательные библиотеки для лаунчера
-   **launcher-pack** - файлы, которые будут включены в jar лаунчера без изменений
-   **config/**  - настройка конфигурации модулей
-   **proguard/**  - настройки Proguard (обфускация кода)
-   **guard/**  - нативная защита (по умолчанию отсутствует)
:::
::::


### Windows

::: danger ТОЛЬКО ДЛЯ ТЕСТИРОВАНИЯ
:::

Настройте окружение:

1. Скачиваем и устанавливаем сборку OpenJDK 17 от  [AdoptJDK](https://adoptium.net/)  (JDK 17 Windows x64 Hotspot) или  [LibericaJDK](https://libericajdk.ru/pages/liberica-jdk/).  **Запомните или запишите путь к установленной JDK**
2. Если вы установили AdoptJDK или любую другую сборку OpenJDK без OpenJFX, скачайте  [jmods](https://download2.gluonhq.com/openjfx/17.0.0.1/openjfx-17.0.0.1_windows-x64_bin-jmods.zip)  и  [sdk](https://download2.gluonhq.com/openjfx/17.0.0.1/openjfx-17.0.0.1_windows-x64_bin-sdk.zip)  и скопируйте содержимое архивов  **с заменой**  в папку установки JDK, полученную на первом этапе
3. Скачиваем сборку JDK 8 от  [AdoptJDK](https://adoptium.net/)  (JDK 8 Windows x64 Hotspot),  [LibericaJDK](https://libericajdk.ru/pages/liberica-jdk/)  или  [Oracle](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)  и устанавливаем

Далее вам необходимо установить лаунчсервер **ВРУЧНУЮ**, без использования скрипта установки

1. На странице  [Launcher releases](https://github.com/GravitLauncher/Launcher/releases)  найдите последний релиз и скачайте его
2. Распакуйте библиотеки и LaunchServer.jar из архива
3. Создайте ```start.bat``` с таким содержимым:

    ```bash
    @ECHO OFF
    "ПУТЬ_ДО_JDK_17/bin/java.exe" -javaagent:LaunchServer.jar -jar LaunchServer.jar
    PAUSE
    ```
4. Запустите ```start.bat``` и при первом запуске укажите свой projectName и localhost в качестве адреса
5. Скачайте рантайм для вашей версии лаунчера:  [LauncherRuntime releases](https://github.com/GravitLauncher/LauncherRuntime/releases)
6. Скопируйте папку runtime в папку с установленным лаунчсервером, а .jar файл модуля в папку launcher-modules
7. Запустите лаунчсервер и выполните команду build для запуска сборки. После окончания готовый лаунчер появится в папке ```updates```

### Dev-версии

DEV версии лаунчсервера содержат самый новый функционал и исправления, которые ещё не попали в релиз. Они могут быть нестабильны (вызывать проблемы), иметь расхождение с официальной вики. Настоятельно рекомендуется проверять работоспособность dev версий в тестовом окружении, прежде чем давать игрокам.

-   **Первый способ: Установка скриптом.**  Следуйте  [этой](/install/#launchserver)  инструкции, используя скрипт установки dev-версии: ```https://mirror.gravitlauncher.com/scripts/setup-dev.sh```
-   **Второй способ: Установка через GitHub Actions.**
    -   Зарегистрируйтесь или войдите на  [GitHub](https://github.com/)
    -   Скачайте архивы с  [лаунчером](https://github.com/GravitLauncher/Launcher/actions?query=event%3Apush+branch%3Adev)  и  [рантаймом](https://github.com/GravitLauncher/LauncherRuntime/actions?query=event%3Apush+branch%3Adev)  с GitHub Actions.
    -   Действуйте аналогично установке  [stable версии](/install/#windows) на Windows, используя архивы, скачанные на предыдущем этапе
