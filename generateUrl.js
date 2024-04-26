function convertObjectToURLLink(obj) {
    const baseLink = "https://tgsvr.catizen.ai/api/bot/tmas/gameapp/catizenbot";
    const startParam = obj.start_param;
    const userData = encodeURIComponent(JSON.stringify(obj.user));
    const chatInstance = obj.chat_instance;
    const chatType = obj.chat_type;
    const authDate = obj.auth_date;
    const hash = obj.hash;

    let queryParams = `tgWebAppData=user%3D${userData}%26auth_date%3D${authDate}%26hash%3D${hash}`;
    
    if (startParam !== null && startParam !== undefined) {
        queryParams += `%26start_param%3D${startParam}`;
    }
    
    if (chatInstance !== null && chatInstance !== undefined) {
        queryParams += `%26chat_instance%3D${chatInstance}`;
    }
    
    if (chatType !== null && chatType !== undefined) {
        queryParams += `%26chat_type%3D${chatType}`;
    }

    queryParams += `&tgWebAppVersion=7.2&tgWebAppPlatform=weba&tgWebAppBotInline=1&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%230f0f0f%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%238774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%23aaaaaa%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23e53935%22%7D`;

    return `${baseLink}?${queryParams}`;
}

const initDataUnsafe = Telegram.WebApp.initDataUnsafe;

const urlLink = convertObjectToURLLink(initDataUnsafe);
console.log(urlLink);
