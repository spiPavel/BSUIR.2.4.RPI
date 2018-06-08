// Использую для идентификации <p></p> (как составная часть идентификатора), чтобы по id в него выводить соответствующее duration и author.
let currentVideoIndex = 0;
// Для загрузки следующей группы видео.
let nextPageToken = '';
// Если false, то заполняем станицу видеозаписями заново (после повторного нажатия на кнопку поиска)
let addToExistingResults = false;

// Выполняется сразу после загрузки 
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {    
    gapi.client.setApiKey('AIzaSyA13DC5jUrtq2VINLMMqk9QiKKz-hO1KnQ'); // Мой ключ, полученный на https://console.developers.google.com.
}

function onSearchButtonClicked() {
    nextPageToken = ''; // Делает поиск с начала.
    addToExistingResults = false;
    currentVideoIndex = 0;
    searchVideos();
}

function onLoadMoreButtonClicked() {
    addToExistingResults = true;
    searchVideos();
}

function searchVideos() {    
    var request = gapi.client.youtube.search.list({
        type: 'video', // channel/playlist/video
        part: 'snippet', // snippet (only this for 'search')
        q: document.getElementById('searchQuery').value, // user's query
        maxResults: 2, // number of got results per one time
        pageToken: nextPageToken
    });
    request.execute(function(videosResponse) {
        showResponse(videosResponse);
    });
}

function showResponse(videoListResponse) {
    let loadedVideosCount = Object.keys(videoListResponse.items).length;
    let videos = '';
    for (let i = 0; i < loadedVideosCount; i++) {
        let video = `<div class="video" style="min-width:300px;margin:5px;">` +
                        `<a href="https://www.youtube.com/watch?v=${videoListResponse.items[i].id.videoId}">` +
                            `<img class="imageLogo" src="${videoListResponse.items[i].snippet.thumbnails.high.url}" alt="${videoListResponse.items[i].snippet.title}" style="width: 100%; max-width: 200px">` +
                        `</a>` +
                        `<a href="https://www.youtube.com/watch?v=${videoListResponse.items[i].id.videoId}">` +
                            `<h3>${videoListResponse.items[i].snippet.title}</h3>` +
                        `</a>` +                        
                        `<p class="durat" id="durat${currentVideoIndex}">...</p>` +
                        `<p class="auth" id="auth${currentVideoIndex}">...</p>` +
                        `<p class="descr">${videoListResponse.items[i].snippet.description}</p>` +
                    `</div>`;

        videos += video;
        document.getElementById('query-result').innerHTML += video;
        getDuration(currentVideoIndex, videoListResponse.items[i].id.videoId);
        getAuthor(currentVideoIndex, videoListResponse.items[i].snippet.channelId);

        currentVideoIndex++;                   
    }

    // Если снова нажата кнопка поиск, заполнение результатами заново.
    if (!addToExistingResults) {
        document.getElementById('query-result').innerHTML = videos;
    }
    
    // Используется в запросе для получения следующей группы видео.
    nextPageToken = videoListResponse.nextPageToken;

    document.getElementById('loadMoreButton').style.visibility = "visible";
}

function getDuration(videoIndex, videoId) {
    var request = gapi.client.youtube.videos.list({
        id: videoId,
        part: 'contentDetails',
    });

    request.execute(function(durationResponse) {
        document.getElementById(`durat${videoIndex}`).innerHTML = getNormalizedDuration(durationResponse.items[0].contentDetails.duration);        
    });

    function getNormalizedDuration(duration) {
        if (duration === 'PT0S') {
            return 'Live'; // В эфире, ещё не закончилась транслция.
        }
    
        let match = duration.match(/PT(\d+)M(\d+)S/i); // PT(minutes)M(seconds)S
        let result = match[1] + ':' + (match[2] >= 10 ? match[2] : '0' + match[2]);
        return result;
    }
}

function getAuthor(videoIndex, channelId) {
    var request = gapi.client.youtube.channels.list({
        id: channelId,
        part: 'snippet',      
    });

    request.execute(function(authorResponse) {
        document.getElementById(`auth${videoIndex}`).innerHTML = authorResponse.items[0].snippet.title;
    });
}