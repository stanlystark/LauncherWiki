import { defaultTheme } from '@vuepress/theme-default'
import { searchPlugin } from '@vuepress/plugin-search'
import { containerPlugin } from '@vuepress/plugin-container'

export default {
    head: [
        ['link', {rel: 'icon', type: 'image/png', sizes: '16x16', href: `/images/icons/favicon-16x16.png`,}],
        ['link', {rel: 'icon', type: 'image/png', sizes: '32x32', href: `/images/icons/favicon-32x32.png`,}],
    ],
    lang: 'ru',
    title: 'GravitLauncher',
    description: 'GravitLauncher - лучший лаунчер Minecraft для Вашего проекта',
    port: '8080', // Порт на котором запускается VuePress
    theme: defaultTheme({
        repo: 'GravitLauncher/Launcher',
        docsRepo: 'https://github.com/GravitLauncher/LauncherWiki',
        docsBranch: 'main',
        docsDir: 'docs',
        editLinkPattern: ':repo/edit/:branch/:path',
        locales: {
            '/': {
                editLinkText: 'Измените эту страницу на GitHub',
                lastUpdatedText: "Последнее обновление",
                notFound: [
                    "Здесь ничего нет.",
                    "Как мы тут оказались?",
                    "Похоже, у нас есть несколько неработающих ссылок."
                ],
                backToHome: "Вернуться на главную",
                openInNewWindow: "открыть в новом окне",
                toggleDarkMode: "переключить темный режим",
                toggleSidebar: "переключить боковую панель",
                contributors: true,
                contributorsText: "Участники",
            },
        },
        logo: 'images/hero.png',
        navbar: [
            {
                text: 'Руководство',
                children: [
                    {
                        text: 'Основы',
                        children: [
                            '/guide/README.md',
                            '/hosting/README.md',
                            '/install/README.md',
                        ],
                    },
                    {
                        text: 'Рантайм',
                        children: [
                            '/runtime/guide/README.md',
                            '/runtime/encrypt/README.md',
                            '/runtime/java/README.md',
                            '/runtime/other/README.md',
                        ],
                    },
                    {
                        text: 'Настройка',
                        children: [
                            '/auth/README.md',
                            '/clientbuild/README.md',
                            '/servers/README.md',
                        ],
                    },
                    {
                        text: 'Разработчикам',
                        children: [
                            '/dev/auth/README.md',
                            '/dev/README.md',
                        ],
                    },
                    {
                        text: 'Разное',
                        children: [
                            '/sign/README.md',
                            '/other/README.md',
                        ],
                    },
                ],
            },
            {
                text: 'Зеркало',
                link: 'https://mirror.gravitlauncher.com/',
            },
            {
                text: 'Discord',
                link: 'https://discord.gg/b9QG4ygY75',
            },
        ],
        sidebar: [
            {
                text: 'Основы',
                collapsible: false,
                children: [
                    '/guide/README.md',
                    '/hosting/README.md',
                    '/install/README.md',
                ],
            },
            {
                text: 'Рантайм',
                collapsible: false,
                children: [
                    '/runtime/guide/README.md',
                    '/runtime/encrypt/README.md',
                    '/runtime/java/README.md',
                    '/runtime/other/README.md',
                ],
            },
            {
                text: 'Настройка',
                collapsible: false,
                children: [
                    '/auth/README.md',
                    '/clientbuild/README.md',
                    '/servers/README.md',
                ],
            },
            {
                text: 'Разработчикам',
                collapsible: false,
                children: [
                    '/dev/auth/README.md',
                    '/dev/README.md',
                ],
            },
            {
                text: 'Разное',
                collapsible: false,
                children: [
                    '/sign/README.md',
                    '/other/README.md',
                ],
            },
        ],
    }),
    plugins: [
        containerPlugin({}),
        searchPlugin({})
    ]
}