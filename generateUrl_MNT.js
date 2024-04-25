function generateUrl() {
    // Extract data from localStorage
    // let localStorageData = JSON.parse(localStorage.getItem("CAT_LOGINDATA_1"));
    // let token = localStorageData?.token;

    // Extract data from sessionStorage
    let sessionStorageData = JSON.parse(sessionStorage.getItem("__telegram__initParams"));
    let tgWebAppData = encodeURIComponent(sessionStorageData.tgWebAppData);
    let tgWebAppVersion = sessionStorageData.tgWebAppVersion;
    let tgWebAppPlatform = sessionStorageData.tgWebAppPlatform;
    let tgWebAppBotInline = sessionStorageData.tgWebAppBotInline;
    let tgWebAppThemeParams = encodeURIComponent(sessionStorageData.tgWebAppThemeParams);

    // Extract data from Telegram.WebApp.initDataUnsafe
    let telegramData = Telegram.WebApp.initDataUnsafe;
    let query_id = telegramData.query_id;
    let user = encodeURIComponent(JSON.stringify(telegramData.user));
    let auth_date = telegramData.auth_date;
    let hash = telegramData.hash;

    // Generate URL  
    let url = `https://tgsvr.catizen.ai/api/bot/tmas/gameapp/Catizen_Mntbot?#tgWebAppData=query_id%3D${query_id}%26user%3D${user}%26auth_date%3D${auth_date}%26hash%3D${hash}&tgWebAppVersion=${tgWebAppVersion}&tgWebAppPlatform=${tgWebAppPlatform}&tgWebAppBotInline=${tgWebAppBotInline}&tgWebAppThemeParams=${tgWebAppThemeParams}`;
    return url;
}
generateUrl()