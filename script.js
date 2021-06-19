const API_KEY ="api_key=19f40b82481158efae3061ed93dc8023";
const BASE_URL ="https://api.themoviedb.org/3";
const LATEST_URL = BASE_URL + "/discover/movie?with_genres=18&primary_release_year=2021&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL + "/search/movie?"+ API_KEY;
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const latestrelease = document.getElementById('latestrelease');
const genre = document.getElementById('genre');
const tagEl = document.getElementById('tags');
const watched =document.getElementById("watched");
const GENRE_URL = BASE_URL+"/discover/movie?sort_by=popularity.desc&"+ API_KEY+"&with_genres=";
const user_id=document.getElementById("user_id");
const rec = document.getElementById("rec");
const watchedlist = document.getElementById("watchedlist");
const genrelist =[
       {
          "id":28,
          "name":"Action"
       },
       {
          "id":12,
          "name":"Adventure"
       },
       {
          "id":16,
          "name":"Animation"
       },
       {
          "id":35,
          "name":"Comedy"
       },
       {
          "id":80,
          "name":"Crime"
       },
       {
          "id":99,
          "name":"Documentary"
       },
       {
          "id":18,
          "name":"Drama"
       },
       {
          "id":10751,
          "name":"Family"
       },
       {
          "id":14,
          "name":"Fantasy"
       },
       {
          "id":36,
          "name":"History"
       },
       {
          "id":27,
          "name":"Horror"
       },
       {
          "id":10402,
          "name":"Music"
       },
       {
          "id":9648,
          "name":"Mystery"
       },
       {
          "id":10749,
          "name":"Romance"
       },
       {
          "id":878,
          "name":"Science Fiction"
       },
       {
          "id":10770,
          "name":"TV Movie"
       },
       {
          "id":53,
          "name":"Thriller"
       },
       {
          "id":10752,
          "name":"War"
       },
       {
          "id":37,
          "name":"Western"
       }
    ]
var selectedGenre=[]
var userlist =[
    {
        "user_ID": "",
        "watched_id":[],
        "watch_later_id":[]
    }
]
homePage();
function homePage(){
    latestrelease.innerHTML='Latest releases:';
    getMovies(LATEST_URL);
}

function setGenre(){
    //console.log('ok');
    tagEl.innerHTML='';
    genrelist.forEach(genre =>{
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText=genre.name;
        t.addEventListener('click', ()=>{
            if(selectedGenre.length==0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if (id== genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(GENRE_URL+encodeURI(selectedGenre.join(',')))
            hightlightSelection();
        })
        tagEl.append(t);
    })
}
function hightlightSelection(){
    const tags =document.querySelectorAll('.tag')
    tags.forEach(tag =>{
        tag.classList.remove('hightlight')
    })
    clearBtn();
        if(selectedGenre.length!=0){
            selectedGenre.forEach(id=>{
                const hightlightedtag=document.getElementById(id);
                hightlightedtag.classList.add('hightlight')
            })
        }
    }
function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('hightlight')
    }else{
    let clear = document.createElement('div');
    clear=classList.add('tag', 'hightlight');
    clear.id='clear';
    clear.innerText= 'Clear All';
    clear.addEventListener('click', ()=>{
        selectedGenre=[];
        setGenre();
        homePage();
    })
    tagEl.append(clear);
    }

}
genre.addEventListener('click', (e)=>{
    setGenre();
})
function getMovies(url){
    fetch(url).then(res => res.json()).then(data =>{
        //console.log(data.results);
        if(data.results.length!==0){
            showMovies(data.results);
        }else{
            latestrelease.innerHTML='';
            main.innerHTML='<h1>No result found</h1>'
        }
    })
}
function showMovies(data){
    main.innerHTML='';
    data.forEach(movie => {
        const {id, title, poster_path, vote_average, overview}= movie;
        const movieEl =document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML=`
        <div class="poster">
            <img  src="${poster_path? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">
            <!--
            <div class="watched">Watched</div>
            <div class="watchlater">Later</div> -->
        </div>
            <div class="movie-info">
                <h3 id="title ">${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                ${overview}
            </div>
        `
        movieEl.addEventListener("click", function (){
            if (confirm("Add to Watched List?")) {
                //console.log(title);
                let currentuser= userlist.find(user => user.user_ID===user_id.innerHTML);
                if (currentuser!=null){
                    userlist.forEach(user =>{
                        if (user.user_ID==user_id.innerHTML){
                            user.watched_id.push(id);
                        }
                        //console.log(user_id.innerHTML);
                    })
                }else{
                    let new_user = {
                        "user_ID": user_id.innerHTML,
                        "watched_id":[id],
                        "watch_later_id":[]
                    }
                    userlist.push(new_user);

                }
                console.log(userlist);
              } else {
                if(confirm("Add to WatchLater List?")){
                    let user= userlist.find(user => user.user_ID==user_id);
                if (user!==null){
                    userlist.forEach(user =>{
                        if (user.user_ID==user_id.innerHTML){
                            user.watch_later_id.push(id);
                        }
                    })
                }else{
                    let new_user = {
                        "user_ID": user_id.innerHTML,
                        "watched_id":[],
                        "watch_later_id":[id]
                    }
                    userlist.push(new_user);

                }
                console.log(userlist);
                } else {
                    console.log("Nothing");
                }
              } 
        })
        main.appendChild(movieEl);
        
    });
}
function getColor(vote){
    if(vote>=8){
        return 'green'
    } else if (vote>=5){
        return 'orange'
    } else{
        return 'red'
    }
}
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const searchTerm=search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm){
        latestrelease.innerHTML='Results: ';
        getMovies(SEARCH_URL+'&query='+searchTerm)
    } else{
        homePage();
    }
})
rec.addEventListener("click", ()=>{
    userlist.forEach(user=>{
        user.watched_id.forEach(id=>{
            getMovies("https://api.themoviedb.org/3/movie/"+id+"/recommendations?"+API_KEY);
        })
    })
})
watchedlist.addEventListener("click", ()=>{
    userlist.forEach(user=>{
        user.watched_id.forEach(id=>{
            getMovies("https://api.themoviedb.org/3/movie/"+id+"?api_key=19f40b82481158efae3061ed93dc8023");
        })
    })
})
