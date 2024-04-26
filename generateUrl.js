function convertObjectToURLLink(obj) {
    const baseLink = "https://tgsvr.catizen.ai/api/bot/gameapplogin";
    const botname = "catizenbot";
    const tguserid = obj.user.id;
    const tgusername = obj.user.username;
    const ts = obj.auth_date;
    const sign = obj.hash;

    const queryParams = `botname=${botname}&tguserid=${tguserid}&tgusername=${tgusername}&ts=${ts}&sign=${sign}#tgWebAppVersion=7.2&tgWebAppPlatform=weba&tgWebAppBotInline=1&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23000000%22%2C%22hint_color%22%3A%22%23707579%22%2C%22link_color%22%3A%22%233390ec%22%2C%22button_color%22%3A%22%233390ec%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%23f4f4f5%22%2C%22header_bg_color%22%3A%22%23ffffff%22%2C%22accent_text_color%22%3A%22%233390ec%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%23707579%22%2C%22subtitle_text_color%22%3A%22%23707579%22%2C%22destructive_text_color%22%3A%22%23e53935%22%7D`;

    return `${baseLink}?${queryParams}`;
}

const initDataUnsafe = Telegram.WebApp.initDataUnsafe

const urlLink = convertObjectToURLLink(initDataUnsafe);
console.log(urlLink);
