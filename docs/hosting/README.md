# Хостинг

[[toc]]

## Выбор хостинга

Для работы правильной лаунчсервера необходим **виртуальный (VDS/VPS)** или **выделенный (Dedicated)** сервер на дистрибутиве **Linux** ([Windows](/#установка-на-windows-только-для-тестирования)*), а так же:

-  Один из актуальных дистрибутивов: **Ubuntu 22.04**, **Debian 11**, **CentOS 8**, **ArchLinux** и другие
-  Веб-сервер **Nginx** для раздачи статического контента
-  Минимум **300Мб свободной оперативной памяти** для работы лаунчсервера
-  При сборке лаунчсервера из исходников прямо на машине может потребоваться до **1 Гб свободной оперативной памяти** для работы Gradle

*Опционально:*

-  Веб-сайт, CMS или личный кабинет с поддерживаемым алгоритмом хеширования
-  База данных **MySQL/MariaDB** или **PostgreSQL**

*Рекомендации:*

-  Не размещайте сайт на shared хостинге, так как это может привести к проблемам с подключением к базе данных, производительностью и стабильностью работы
-  Хостинги, предоставляющие VDS/VPS на основе виртуализации OpenVZ не позволяют использовать некоторые программы и нагружать процессор выше определенного уровня длительное время
-  Старые версии дистрибутивов могут содержать уязвимости или слишком старые версии ПО с большим количеством багов. В таком случае рекомендуется обновиться до последней версии или сменить хостинг провайдера

_\* Если вы хотите установить лаунчсервер на Windows для локального тестирования следуйте [этой](/#установка-на-windows-только-для-тестирования) инструкции._


## Настройка хостинга

Первым шагом необходимо подготовить окружение - создать пользователя, установить firewall, Java

### Установка Java

Для запуска LaunchServer необходима Java 17. Она так же подходит для запуска майнкрафт сервера 1.18+

| Версия Minecraft | Версия Java |
|------------------|-------------|
| 1.18+            | Java 17     |
| 1.17.x           | Java 16     |
| 1.16.5 и ниже    | Java 8      |

Необходимо установить их все, если вы собираетесь держать лаунчсервер и сервера на одной машине.

[Debian / Ubuntu](/hosting/#debian-ubuntu) | [Centos](/hosting/#centos) | [Другие](/hosting/#другие)

#### Debian / Ubuntu

1. Обновление, установка необходимого ПО
```bash:no-line-numbers
sudo apt-get update ; sudo apt-get install gnupg2 wget apt-transport-https -y
```

2. Установка репозитория Java
```bash
wget -q -O - https://download.bell-sw.com/pki/GPG-KEY-bellsoft | sudo apt-key add - 
echo "deb [arch=amd64] https://apt.bell-sw.com/ stable main" | sudo tee /etc/apt/sources.list.d/bellsoft.list
```
3. Обновление, установка Java
```bash
sudo apt-get update
sudo apt-get install -y bellsoft-java17-full
```
4. Выбор Java по умолчанию
```bash
sudo update-alternatives --config java
```

**Команда одной строкой**
```bash:no-line-numbers
sudo apt-get update ; sudo apt-get install gnupg2 wget apt-transport-https -y ; wget -q -O - https://download.bell-sw.com/pki/GPG-KEY-bellsoft | sudo apt-key add - ; echo "deb [arch=amd64] https://apt.bell-sw.com/ stable main" | sudo tee /etc/apt/sources.list.d/bellsoft.list ; sudo apt-get update ; sudo apt-get install -y bellsoft-java17-full ; sudo update-alternatives --config java
```
:::: details Целевые архитектуры процессоров: <Badge type="warning" text="Важно" vertical="top" />
::: warning Описание:
- **amd64** является более распространённой архитектурой на текущее время
- Если **amd64** не является целевой архитектурой, замените его в скрипте выше в поле **[arch=amd64]**

Список возможных архитектур:
```bash
amd64, i386, arm64, armhf
```
- Сопоставление:
  - **amd64** - x86 (64 бит)
  - **i386** - x86 (32 бит)
  - **arm64** - aarch64
    :::
    ::: warning Примечание:
- Такие архитектуры как **arm64** и **armhf** не поддерживают сборку EXE - бинарного файла лаунчера, через launch4j
---
- Если ваша архитектура **amd64** или **i386**, включите сборку EXE в конфигурации `LaunchServer.json`:
  - launch4j:
    - enabled: true
      :::
      ::: tip Узнать архитектуру ядра:
```bash
uname -m | awk '{print(substr($0,0,3))}'
```
:::
::: tip Узнать битность ядра:
```bash
getconf LONG_BIT
```
:::
::: tip Удалить из sources.list
- Необходимо, если ошибочно добавили неправильную архитектуру
  - Ошибка в консоли: `E: Unable to locate package bellsoft-java17-full`
```bash
rm -f /etc/apt/sources.list.d/bellsoft.list
```
- Измените архитектуру в скрипте и повторите добавление и установку
:::
::::

#### Centos

```bash
echo | tee /etc/yum.repos.d/bellsoft.repo > /dev/null << EOF
[BellSoft]
name=BellSoft Repository
baseurl=https://yum.bell-sw.com
enabled=1
gpgcheck=1
gpgkey=https://download.bell-sw.com/pki/GPG-KEY-bellsoft
priority=1
EOF
yum update
yum install bellsoft-java17-full
alternatives --config java
```
:::: details Смена Java по умолчанию:
```bash
sudo alternatives --config java
```
::::

#### Другие

Посетите [BELLSOFT Installation Guide](https://bell-sw.com/pages/liberica_install_guide-17.0.5/)


### Создание пользователя

Команда для создания пользователя с именем **launcher**:
```bash:no-line-numbers
sudo useradd -m -G www-data -s /bin/bash launcher
```
_Актуально для Ubuntu, Debian, CentOS, ArchLinux_
:::: details Инструкции по работе с su:
::: tip Выполнение команд от имени пользователя launcher и переход в домашнюю папку:
```bash
su - launcher
```
:::
::: tip Выполнение команд от имени пользователя launcher без смены каталога:
```bash
su launcher
```
:::
::: tip Выход обратно в root:
```bash
exit
```
:::
::::

## Настройка Nginx

### Установка и конфигурация

Для достижения оптимальной производительности отдачи файлов нужно настроить Nginx

- Посетите сайт [nginx](https://nginx.org/en/linux_packages.html) и установите его в соответствии с вашей системой

- Создайте в пространстве имён своего домена **A** запись, вида `launcher.ДОМЕН.ru`, с вашим **IP** машины с лаунчсервером

::: details Путь к конфигурации Nginx:
  Предпочтительно создавать отдельный файл конфигурации для каждого домена отдельно:
  (Воспользуйтесь SFTP клиентом)
```
/etc/nginx/conf.d/launcher.ДОМЕН.ru.conf
```
Если у вас на машине будет только одна настройка, можете отредактировать конфигурацию по умолчанию:
```bash
nano /etc/nginx/conf.d/default.conf
```
:::
:::: code-group
::: code-group-item На DNS имени
```nginx
server {
    listen 80;
    server_name launcher.ВАШДОМЕН.ru;
    charset utf-8;
    #access_log  /var/log/nginx/launcher.ВАШДОМЕН.ru.access.log main;
    #error_log  /var/log/nginx/launcher.ВАШДОМЕН.ru.error.log notice;
    
    root /путь/до/updates;
    
    location / {
    }
    location /api {
        proxy_pass http://127.0.0.1:9274/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /webapi/ {
        proxy_pass http://127.0.0.1:9274/webapi/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
:::
::: code-group-item На IP
```nginx
server {
    listen 80;

    charset utf-8;
    #access_log  /var/log/nginx/launcher.access.log main;
    #error_log  /var/log/nginx/launcher.error.log notice;
    
    root /путь/до/updates;
    
    location / {
    }
    location /api {
        proxy_pass http://127.0.0.1:9274/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /webapi/ {
        proxy_pass http://127.0.0.1:9274/webapi/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
:::
::::

::::: tip Проверить конфигурацию и перезагрузить Nginx:

```bash
nginx -t
```
Должны увидеть:
```log
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```
Включить Nginx как службу Systemd:
```bash
systemctl enable nginx
```
Перезагрузка сервиса:
:::: code-group
::: code-group-item Systemd
```bash
systemctl restart nginx
```
:::
::: code-group-item init.d
```bash
service nginx restart
```
:::
::::
:::::

::: warning
- Без доменного имени перенос лаунчера на другую машину приведёт к отказу самообновления.
- Так же SSL сертификат невозможно выдать на IP. В последствии соединение будет незащищённым и может быть скомпрометировано.
  :::
  ::: details Заметки по правам:
  Если у nginx нет прав для чтения директорий, выдайте:
```bash
chmod +x /home/launcher && chmod -R 755 /home/launcher/updates
```
Изменить группу и пользователя на всё содержимое домашней директории **launcher**:
```bash
chown -R launcher:launcher /home/launcher
```
:::


### Настройка безопасного подключения

Для обеспечения безопасности передаваемых паролей, защиты от внедрения в процесс обмена данными нужно подключить к своему домену SSL сертификат. На данный момент его можно купить, получить или сгенерировать бесплатно (**Let's Encrypt**/**Cloudflare**). Вы должны будете установить его на домен с лаунчсервером ```ВАШДОМЕН.ru``` и немного изменить настройки лаунчсервера:

-   Откройте файл LaunchServer.json и найдите там секцию netty
-   Измените ссылки формата ```http://ДОМЕН ИЛИ IP:9274/ЧТО-ТО``` на ```https://ВАШДОМЕН.ru/ЧТО-ТО```
-   Измените ссылку на websocket лаунчера с ```ws://ДОМЕН ИЛИ IP:9274/api``` на ```wss://ВАШДОМЕН.ru/api```
-   Соберите лаунчер командой ```build``` и проверьте работоспособность
-   Закройте порт 9274 (если он был открыт), так как теперь лаунчсервер будет получать и передавать данные через nginx по портам 80 и 443
