var highlightedSuggestion;
var suggestionList;

function populateSuggestionList() {
    chrome.tabs.query({'windowId': chrome.windows.WINDOW_ID_CURRENT}, function (allTabs){
        suggestionList = defaultSugestions;
        for(tab of allTabs){
            var tabAction = {
                "text": "Switch to: " + tab.title,
                "action": switchToTab(tab.id)
            };
            suggestionList.push(tabAction);
        }
        populateSuggestionsBox(suggestionList);
    });
}

function populateAdditionalSuggestionList(query) {
    var queryList = query.split(" ");
    if(queryList[0].toLowerCase() == "wiki" || queryList[0].toLowerCase() == "wikipedia") {
        var wikiQuery = "";
        queryListLength = queryList.length;
        for(var i = 1; i < queryList.length; i++) {
            wikiQuery += queryList[i];
            if(queryListLength > 2) wikiQuery += " ";
        }
        var tabAction = {
            "searchDomain": "Wikipedia",
            "text": "Wikipedia Search Query: " + wikiQuery,
            "action" : searchWiki(wikiQuery)
        };

        for(var i = 0; i < suggestionList.length; i++) {
            if(suggestionList[i].searchDomain == "Wikipedia") {
                suggestionList.splice(i, 1);
            }
        }
        suggestionList.unshift(tabAction);
    }
    populateSuggestionsBox(suggestionList);
    
}

function reScroll(){
    try{
        scrollElement = highlightedSuggestion.previousSibling.previousSibling;
        scrollElement.scrollIntoView(alignToTop=true);
    }
    catch(err){}
}

function changeHighlighted(newHighlighted){
    highlightedSuggestion.id = "";
    highlightedSuggestion = newHighlighted;
    highlightedSuggestion.id = "highlighted";
}

function handleKeydown(e){
    var keynum = e.which;
    if (keynum == 40){
        // down
        e.preventDefault();
        var newSuggestion = highlightedSuggestion.nextSibling;
        if (!newSuggestion){
            var allSuggestions = document.getElementsByClassName("suggestion");
            newSuggestion = allSuggestions[allSuggestions.length - 1]
        }
        changeHighlighted(newSuggestion);
        reScroll();
        return false;
    }
    else if (keynum == 38){
        // up
        e.preventDefault();
        newSuggestion = highlightedSuggestion.previousSibling;
        if (!newSuggestion){
            newSuggestion = document.getElementsByClassName("suggestion")[0];
        }
        changeHighlighted(newSuggestion);
        reScroll();
        return false;
    }
    else if (keynum == 13){
        // enter
        highlightedSuggestion.click();
    }
}

function handleMouseover(e){
    changeHighlighted(e.srcElement);
}

function populateSuggestionsBox(suggestionList){
    //
    var suggestionDiv = document.getElementById('suggestions');
    suggestionDiv.innerHTML = "";
    
    for (suggestion of suggestionList) {
        var suggestionTag = document.createElement("li");
        suggestionTag.className = "suggestion";
        suggestionTag.innerHTML = suggestion.text;
        suggestionTag.onclick = suggestion.action;
        suggestionTag.onmouseover = handleMouseover;
        suggestionDiv.appendChild(suggestionTag);
        console.log(suggestionTag);
    }
    highlightedSuggestion = document.getElementsByClassName("suggestion")[0];
    highlightedSuggestion.id = "highlighted";
}

function fuzzySearch(){
    var options = {
        keys: ['text']
    }
    var searchString = document.getElementById("command").value;
    if (searchString == ""){
        populateSuggestionList();
    }
    else{
        populateAdditionalSuggestionList(searchString);
        var fuzz = new Fuse(suggestionList, options);
        var fuzzResult = fuzz.search(searchString);
        populateSuggestionsBox(fuzzResult);
        delete fuzz;
    }
}

function initCommander() {
    populateSuggestionList();
    document.getElementById("command").oninput = fuzzySearch;
    document.onkeydown = handleKeydown;
}

document.addEventListener('DOMContentLoaded', initCommander, false);
