document.addEventListener('DOMContentLoaded', async function () {
    const site = (await chrome.storage.local.get("lastSite")).lastSite;
    const selector = (await chrome.storage.local.get("lastSelector")).lastSelector;

    document.getElementById("site").innerText = `Site: ${site}`;
    document.getElementById("selector").innerText = `Selector: ${selector}`;
});
