# Расширение браузера переводчика Яндекс

Добавляет возможность перевода страниц с помощью сервиса переводчика Яндекс.
Для использования возможностей службы переводчика требуется API ключ,
устанавливаемый через панель настроек дополнения. Авторизации посвящена
[данная страница](https://cloud.yandex.ru/docs/translate/api-ref/authentication) в документации,
создание API ключей описано в [этой статье](https://cloud.yandex.ru/docs/iam/operations/api-key/create).

## Установка

Файлы расширения для firefox и chromium можно собрать или загрузить со страницы выпусков.
Сборка дополнения описывается в соответствующем пункте.

В firefox перед установкой следует включить возможность установки расширений без цифровых подписей.
Что осуществляется переходом по адресу about:config и установкой значения свойства
xpinstall.signatures.required равному false. После открыть about:addons - панель управления дополнениями,
перетащить файл extension.firefox.xpi в область страницы.

Перед установкой в chromium или chrome требуется распаковать архив extension.chromium.zip.
После запустить браузер, перейти на страницу дополнений и включить режим разработчика. Затем нажать кнопку установки
неупакованного расширения и выбрать папку распакованного архива extension.chromium.zip.

## Сборка

Для сборки потребуется скачать репозиторий, что можно сделать командой
`git clone https://github.com/ArundhatiApte/yandex-translator-browser-extension.git path/to/cloned-repo`.
Также нужны node.js, npm, npx и python3. Перейдя в каталог репозитория установить все зависимости командой
`npm install`. Собирающий расширение сценарий - buildExtension.py находится в папке для сборки building/.
Скрипт принимает 3-и параметра:

* конфигурацию (тестовая|основная - test|prod)
* минифицировать ли код (да|нет - 0|1)
* браузер (firefox|chromium)

Например, сборка дополнения, настроенного на использование реального сервиса переводчика Яндекс,
с минификацией кода для браузера firefox выполняется командой: `python3 buildExtension.py prod 1 firefox`.
Данный скрипт должен запускаться из папки building/. После выполнения сценария в папке building/result/ появится файл
extension.firefox.xpi, если целевой браузер был указан firefox, если chromium - extension.chromium.zip.
