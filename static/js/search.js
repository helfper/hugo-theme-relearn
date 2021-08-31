var lunrIndex, pagesIndex;

// Initialize lunrjs using our generated index file
function initLunr() {
    // First retrieve the index file
    $.getJSON(index_url)
        .done(function(index) {
            pagesIndex = index;
            // Set up lunrjs by declaring the fields we use
            // Also provide their boost level for the ranking
            lunrIndex = lunr(function() {
                this.ref('index');
                this.field('title', {
                    boost: 15
                });
                this.field('tags', {
                    boost: 10
                });
                this.field('content', {
                    boost: 5
                });

                this.pipeline.remove(lunr.stemmer);
                this.searchPipeline.remove(lunr.stemmer);

                // Feed lunr with each file and let lunr actually index them
                pagesIndex.forEach(function(page, idx) {
                    page.index = idx;
                    this.add(page);
                }, this);
            })
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ', ' + error;
            console.error('Error getting Hugo index file:', err);
        });
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} term
 * @return {Array}  results
 */
function search(term) {
    // Find the item in our index corresponding to the lunr one to have more info
    // Remove Lunr special search characters: https://lunrjs.com/guides/searching.html
    var searchTerm = lunr.tokenizer(term.replace(/[*:^~+-]/, ' ')).flatMap(token => searchPatterns(token.str)).join(' ');
    var suggestions = !searchTerm ? [] : lunrIndex.search(searchTerm).map(function(result) {
        return { index: result.ref, matches: Object.keys(result.matchData.metadata), value: result.ref }
    });
    return { suggestions: suggestions };
}

function searchPatterns(word) {
    return [
        word + '^100',
        word + '*^10',
        '*' + word + '^10',
        word + '~' + Math.floor(word.length / 4) + '^1' // allow 1 in 4 letters to have a typo
    ];
}

// Let's get started
initLunr();
$(function() {
    $('#search-by').autocomplete({
        appendTo: $('#search-by').parent(),
        preserveInput: true,
        lookup: function(query, done) {
            done(search(query));
        },
        formatResult: function(suggestion, currentValue) {
            var page = pagesIndex[suggestion.index];
            var numContextWords = 2;
            var contextPattern = '(?:\\S+ +){0,' + numContextWords + '}\\S*\\b(?:' +
                suggestion.matches.map(match => match.replace(/\W/g, '\\$&')).join('|') +
                ')\\b\\S*(?: +\\S+){0,' + numContextWords + '}';
            var context = page.content.match(new RegExp(contextPattern, 'i'));
            var divcontext = document.createElement('div');
            divcontext.className = 'context';
            divcontext.innerText = (context || '');
            var divsuggestion = document.createElement('div');
            divsuggestion.innerText = '» ' + page.title;
            divsuggestion.appendChild(divcontext);
            return divsuggestion.innerHTML;
        },
        onSelect: function(suggestion) {
            var page = pagesIndex[suggestion.index];
            location.href = baseUri + page.uri;
        }
    });
});
