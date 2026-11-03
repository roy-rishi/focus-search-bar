const NON_TEXT = ['hidden', 'checkbox', 'radio', 'button', 'submit', 'reset', 'image', 'file', 'range', 'color'];

const SEARCH_SELECTORS = [
    'input[type="search" i]',           // standard type for search fields
    'input[placeholder*="search" i]',   // placeholder text
    'input[aria-label*="search" i]',    // aria label
    '[role="searchbox"]',               // aria role
    'input[name="q" i], input[name="query" i], input[name="search" i], input[name="s" i], input[name*="keyword" i]',  // name
    'input[id*="search" i]',            // id
    'input[class*="search" i]',         // class
];

function isEditable(e: EventTarget): boolean {
    if (!(e instanceof HTMLElement))
        return false;
    if (e.isContentEditable)
        return false;
    if (!(e instanceof HTMLInputElement))
        return false;
    return !NON_TEXT.includes(e.type);
}

function selectInput(e: HTMLInputElement) {
    e.focus();
}

function findInputElem(): HTMLInputElement | null {
    for (const sel of SEARCH_SELECTORS) {
        const matches = Array.from(document.querySelectorAll<HTMLInputElement>(sel));
        const usableMatches = matches.filter(
            (el) => !el.disabled && !el.readOnly && el.type !== "hidden");
        if (usableMatches.length === 0)
            continue;

        console.log(`Search Bar?: Using selector '${sel}'`);
        return (matches[0]);
    }
    return null;
}

document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key !== "/")
        return;
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)
        return;

    // allow '?' to pass through when typing in an editable field
    const invokedFrom = e.composedPath()[0];
    if (isEditable(invokedFrom))
        return;

    // use a hard-coded selector if implemented for the hostname
    let searchBar: HTMLInputElement | null = null;
    switch (window.location.hostname.toLowerCase()) {
        case "www.amazon.com":
            const elem = document.getElementById("twotabsearchtextbox");
            if (!elem || !(elem instanceof HTMLInputElement)) return;
            searchBar = elem;
            break;
    }

    if (!searchBar) {
        // try to select the search bar using generic selectors
        console.log("Search Bar?: Using generic selectors");
        searchBar = findInputElem();
    } else {
        console.log("Search Bar?: Using hard-coded selector");
    }

    if (!searchBar) {
        console.error("Search Bar?: Failed find search bar");
        return;
    }

    // delay to allow the webpage the handle this event first
    setTimeout((_: any) => {
        if (e.defaultPrevented)
            return;  // the webpage already handled this event

        e.preventDefault();
        selectInput(searchBar);
    }, 50);
});
