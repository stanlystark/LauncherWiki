# Дополнительно

[[toc]]

## Подключение зависимостей

Для написания модулей для лаунчсервера вам нужно подключить следующие библиотеки:

<CodeGroup>
  <CodeGroupItem title="Gradle (Short)" active>

```properties
implementation "pro.gravit.launcher:launcher-core:5.2.9"
implementation "pro.gravit.launcher:launcher-ws-api:5.2.9"
implementation "pro.gravit.launcher:launchserver-api:5.2.9"
```

  </CodeGroupItem>
  <CodeGroupItem title="Maven" active>

```xml
<dependency>
    <groupId>pro.gravit.launcher</groupId>
    <artifactId>launcher-core</artifactId>
    <version>5.2.9</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
<dependency>
    <groupId>pro.gravit.launcher</groupId>
    <artifactId>launcher-ws-api</artifactId>
    <version>5.2.9</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
<dependency>
    <groupId>pro.gravit.launcher</groupId>
    <artifactId>launchserver-api</artifactId>
    <version>5.2.9</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

  </CodeGroupItem>
</CodeGroup>

Для написания модулей для лаунчера вам нужно подключить следующие библиотеки:

<CodeGroup>
  <CodeGroupItem title="Gradle (Short)" active>

```properties
implementation "pro.gravit.launcher:launcher-core:5.2.9"
implementation "pro.gravit.launcher:launcher-ws-api:5.2.9"
implementation "pro.gravit.launcher:launcher-client-api:5.2.9"
```

  </CodeGroupItem>
  <CodeGroupItem title="Maven" active>

```xml
<dependency>
    <groupId>pro.gravit.launcher</groupId>
    <artifactId>launcher-core</artifactId>
    <version>5.2.9</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
<dependency>
    <groupId>pro.gravit.launcher</groupId>
    <artifactId>launcher-ws-api</artifactId>
    <version>5.2.9</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
<dependency>
    <groupId>pro.gravit.launcher</groupId>
    <artifactId>launcher-client-api</artifactId>
    <version>5.2.9</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

  </CodeGroupItem>
</CodeGroup>

## Написание модуля

Загрузка модулей происходит из папки modules. Менеджер модулей открывает по очереди все jar и смотрит на параметр
Module-Main-Class в манифесте JAR файла.

Главный класс модуля - это класс, наследуемый от  **pro.gravit.launcher.modules.LauncherModule**  и реализующий метод
init(LauncherInitContext initContext)

Метод init вызывается при инициализации модуля на ранних этапах запуска лаунчера или лаунчсервера. Поэтому реализовывать
логику внутри метода init  **запрещено**. Внутри метода init разрешается обращаться только к методам modulesManager и
initContext, при этом при статической загрузке модуля initContext = null, а при динамической загрузке модуля через
команду loadModule он будет содержать инстанс контекста, из которого можно получить доступ к LaunchServer

## События(евенты)

Всё что можно сделать из init - загружать другие модули, получать их инстансы и, самое важное,  **подписаться на
события**. Это единственный правильный способ реализовывать логику. При наступлении события менеджер модулей
последовательно проходится по всем модулям в порядке приоритета и вызывает соответствующие обработчики

Встроеные события находятся в pro.gravit.launcher.modules.event

События лаунчсервера находятся в pro.gravit.launchserver.modules.events. Вы должны использовать при работе с
лаунчсервером, так как внутри них содержится инстанс LaunchServer - главный объект лаунчсервера

События лаунчера находятся в pro.gravit.launcher.client.events. Они отвечают за основные события, происходящие в
клиентской части лаунчера

Для подписки на событие вы должны создать метод в вашем классе, принимающий 1 аргумент соответствующий типу события,
которое вы хотите обрабатывать, после чего в методе init вы должны вызвать метод registerEvent, первый аргумент которого
- ваш метод-обработчик, второй аргумент - класс интересующего вас события

Обратите внимание при загрузке модуля через loadModule события, которые уже прошли не вызываются, вместо этого вам
передается initContext

## Внешние API

Вы можете использовать некоторые API лаунчера извне в вашем моде Minecraft. Вот список пакетов, к которым можно
обращаться извне:

- **pro.gravit.utils**  - утилитные классы и хелперы
- **pro.gravit.launcher.events**  - ответы на запросы к лаунчсерверу и отдельные события
- **pro.gravit.launcher.request**  - запросы к лаунчсерверу
- **pro.gravit.launcher.api**  - Информация о текущем пользователе и профиле

## Написание AuthCoreProvider

Для интеграции собственных CMS и сайтов с лаунчером рекомендуется написать свой AuthCoreProvider. Для этого Создайте
класс наследник AuthCoreProvider и реализуйте обязательные методы  [oauth](../dev/#реализация-oauth)  после чего
реализуйте необходимые вам расширения:

Расширения класса AuthCoreProvider

- **AuthSupportExit**  - вы поддерживаете методы завершения сессии пользователя
- **AuthSupportGetAllUsers**  - вы поддерживаете метод получения всех пользователей
- **AuthSupportGetSessionsFromUser**  - вы поддерживаете получение списка сессий пользователя
- **AuthSupportHardware**  - вы поддерживаете работу с HWID ```важно```

- **AuthSupportRegistration**  - вы поддерживаете регистрацию пользователей
- **AuthSupportUserBan**  - вы поддерживаете методы ban и unban

Расширения класса User

- **UserSupportTextures**  - ваш объект User хранит и предоставляет информацию о скинах и плащах. Вы должны вернуть
  соответствующие текстуры с метаданными при их наличии. При использовании этих методов TextureProvider больше не
  требуется
- **UserSupportHardware**  - ваш объект User хранит информацию о железе пользователя
- **UserSupportBanInfo**  - ваш объект User хранит информацию о банах пользователя
- **UserSupportAdditionalData**  - ваш объект User поддерживает кастомные параметры(такие как email, монеты и т.д.)
