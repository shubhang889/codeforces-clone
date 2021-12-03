import './App.css';

import {useEffect, useState} from 'react';
import _, {debounce} from 'lodash';
 


let totalContestsList = [] ;
let showFav = false ;

function convertDate(sec) {
    return new Date(sec*1000).toString();
}

function convertSectoMins(mins) {
    return (mins/60) ;
}



function App() {
    const[uiArray, setUiArray] = useState([]) ;
    const[pageSize, setPageSize] = useState(10) ;
    const[query, setQuery] = useState("") ;
    const[contestType,setContestType] = useState("CF") ;
    const[pageNo, setPageNo] = useState(1) ;
    const[contestPhase, setContestPhase] = useState("BEFORE") ;

    useEffect(() => {
        console.log('called when aoi called');
        const url = "https://codeforces.com/api/contest.list";

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                console.log(json);
                if(json.status==='OK') {
                    totalContestsList = json.result;
                } 
                else {
                    totalContestsList = [] ;
                }
                totalContestsList.forEach((obj) => {
                    obj["isFavourite"]=false ;
                })
                console.log(totalContestsList, "totalContestsList") ;
                let filtered = totalContestsList.filter((obj) => obj.phase===contestPhase && obj.type===contestType) ;
            
                console.log(filtered.slice(0,pageSize), 'uiArray') ;
                setUiArray(filtered.slice(0,pageSize)) ;

            } catch (error) {
                console.log("error", error);
            }
        };
        fetchData();
    }, []);  

    const debouncedChange = debounce(function handleQueryChange(event) {
        let filtered = totalContestsList.filter((obj) => {
            if (event.target.value === '') {
                return obj;
            } 
            else if (obj.name.toLowerCase().includes(event.target.value.toLowerCase())) {
                return obj; 
            }
        }) ;
        setUiArray(filtered.slice(0,pageSize)) ;

    }, 500)
 
    function handleTypeChange(event) {
        setPageNo(1) ;
        setContestType(event.target.value) ;
    }

    useEffect(() => {
         
        
        let filtered = totalContestsList.filter((obj) => obj.type===contestType && obj.phase===contestPhase) ;

        setUiArray(filtered.slice(0,pageSize)) ;
        
    }, [contestType]);

    function handlePageSizeChange(event) {
        setPageSize(event.target.value);
    }
    
    useEffect(() => {
        
        setUiArray(totalContestsList.filter((obj) => (obj.type===contestType && obj.phase===contestPhase)).slice(0,pageSize));
        
    }, [pageSize]);

    function handlePhaseChange(event) {
        setPageNo(1) ;
        console.log("PhaseChange", pageNo) ;
        setContestPhase(event.target.value) ;
        console.log("Phase:", contestPhase) ;
    }

    useEffect(() => {
        let filtered = totalContestsList.filter((obj) => obj.type===contestType && obj.phase===contestPhase)
        
        setUiArray(filtered.slice(0,pageSize)) ;
        console.log("uiArray:",uiArray) ;
        
    }, [contestPhase]) ;

    function previousPage() {
        if(pageNo>1) {
            setPageNo(pageNo => pageNo-1) ;
        } 
    }
    
    function nextPage() {
        setPageNo(pageNo => pageNo+1) ;
    }
    useEffect(() => {
        console.log('pageNo.', pageNo) ;
        console.log("pageSize:",pageSize) ;
        
        let filtered = totalContestsList.filter((obj) => (obj.type===contestType && obj.phase===contestPhase)).slice((pageNo-1)*pageSize,pageSize*pageNo) ;
        setUiArray(filtered) ;
        
    }, [pageNo]) ;
    
    function handleFavouriteClick(obj) {
        console.log(obj.isFavourite) ;
        obj.isFavourite= !obj.isFavourite ;
        console.log(obj.isFavourite, "after") ;
        console.log(uiArray,": uiARRAY") ;

        let filtered = uiArray.slice() ;
        setUiArray(filtered) ;
    }

    function handleShowFavourite(event) {
        showFav = !showFav ;
        if(showFav) {
            let filtered = totalContestsList.filter((obj) => obj.isFavourite===true) ;

            setUiArray(filtered.slice(0,pageSize)) ;
        } else {
            let filtered = totalContestsList.filter((obj) => (obj.type===contestType && obj.phase===contestPhase)) ;

            setUiArray(filtered.slice(0,pageSize)) ;
        }
    }

    
   
  return (
     <div className="App">
        <header className="App-header">
            <div className="App-header-codeforces">
                Codeforces
            </div>
            <div className="App-header-contests">
                Contests
            </div>
        </header>
         <div> 
            <div className="app-page-dropdown-search">
                <div>
                    <input className="search-bar" placeholder="Search" onChange={debouncedChange} />
                </div>
                <div className="app-page-dropdown">
                    <h4>Filters:</h4>
                    <select id="dropdown" onChange={handleTypeChange}>
                        <option value="CF">CF</option>
                        <option value="IOI">IOI</option>
                        <option value="ICPC">ICPC</option>
                    </select>
                    <select id="dropdown" onChange={handlePhaseChange}>
                        <option value="BEFORE">UPCOMING</option>
                        <option value="FINISHED">FINISHED</option>
                        <option value="CODING">ONGOING</option>
                    </select>
                    {showFav==false ? <button className="btn-show-fav" onClick={handleShowFavourite}>Show Favourites</button> : <button className="btn-show-fav" onClick={handleShowFavourite}>Show All</button> }
                </div>
            </div>

            {uiArray.length > 0 ? <div className="app-page">
                {
                    uiArray.map((obj) => (
                        <div className="app-page-details" key={obj.id}>
                            <h3>{obj.name}</h3>
                            <p>Duration : {convertSectoMins(obj.durationSeconds)} Minutes</p>
                            <p>start time : {convertDate(obj.startTimeSeconds)}</p>
                            <p>Type: {obj.type}</p>
                            <p>Phase: {obj.phase}</p> 
                            {obj.isFavourite===false ? <button onClick={() => handleFavouriteClick(obj)} className="btn-mark-fav">Mark as Favourite</button> : 
                            <button onClick={() => handleFavouriteClick(obj)} className="btn-remove-fav">Remove Favourite</button> }
                        </div>
                    ))
                }
            </div> : <h3>NO CONTEST FOUND!</h3>}

            <footer className="app-page-pagination">
                <select id="dropdown" onChange={handlePageSizeChange}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <button className="btn-navigate" onClick={previousPage}>Previous</button>
                <button className="btn-navigate" onClick={nextPage}>Next</button>
                
            </footer>
            
        </div> 

    </div> 
  );
}

export default App;
