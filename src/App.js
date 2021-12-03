import './App.css';
import {RESULT} from './constant';
import {useEffect, useState} from 'react';


let totalContestsList = [] ;

function convertDate(sec) {
    return new Date(sec*1000).toString();
}

function convertSectoMins(mins) {
    return (mins/60) ;
}

function filterFavourites() {
     RESULT.filter((res => res.isFavourite === true)).map((obj) => (
        <div className="app-page-details-ind" key={obj.id}>
            <h3>{obj.name}</h3>
            <p>Duration : {convertSectoMins(obj.durationSeconds)} Minutes</p>
            <p>start time : {convertDate(obj.startTimeSeconds)}</p>
        </div>
    )) ;
}



function App() {
    const[uiArray, setUiArray] = useState([]) ;
    const[pageSize, setPageSize] = useState(10) ;
    const[query, setQuery] = useState("") ;
    const[contestType,setContestType] = useState("ALL") ;
    const[pageNo, setPageNo] = useState(1) ;
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
                console.log(totalContestsList.slice(0,pageSize), 'uiArray') ;
                setUiArray(totalContestsList.slice(0,pageSize)) ;

            } catch (error) {
                console.log("error", error);
            }
        };
        fetchData();
    }, []);  

    function handleQueryChange(event) {
        
        let filtered = totalContestsList.filter((obj) => {
            if (event.target.value === '') {
                return obj;
            } 
            else if (obj.name.toLowerCase().includes(event.target.value.toLowerCase())) {
                return obj; 
            }
        }) ;
        setUiArray(filtered.slice(0,pageSize)) ;

    }
 
    function handleTypeChange(event) {
        setPageNo(1) ;
        setContestType(event.target.value) ;

        
    }

    useEffect(() => {
        if(contestType==="ALL") {
            
            setUiArray(totalContestsList.slice(0,pageSize));
            
        } else { 
        
            let filtered = totalContestsList.filter((obj) => obj.type===contestType) ;
            setUiArray(filtered.slice(0,pageSize)) ;
        }
    }, [contestType]);

    function handlePageSizeChange(event) {
        setPageSize(event.target.value);
    }
    
    useEffect(() => {
        if(contestType==="ALL") {
            setUiArray(totalContestsList.slice(0,pageSize)) ;
        } else {
            setUiArray(totalContestsList.filter((obj) => obj.type===contestType).slice(0,pageSize)) ;
        }
    }, [pageSize]);

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
        if(contestType==="ALL") {
            let filtered = totalContestsList.slice((pageNo-1)*(pageSize),pageSize*pageNo) ;
            console.log("filtered1", filtered) ;
            setUiArray(filtered) ;
        } else {
            let filtered = totalContestsList.filter((obj) => obj.type===contestType).slice((pageNo-1)*pageSize,pageSize*pageNo) ;
            console.log("filtered2", filtered) ;
            setUiArray(filtered) ;
        } 
    }, [pageNo])
    
   
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
        {uiArray.length > 0 ? <div className="app-page"> 
            <div className="App-page-Dropdown-Search">
                <input placeholder="Search" onChange={handleQueryChange} />
                <select id="dropdown" onChange={handleTypeChange}>
                    <option value="ALL">ALL</option>
                    <option value="CF">CF</option>
                    <option value="IOI">IOI</option>
                    <option value="ICPC">ICPC</option>
                </select>
                <button onClick={filterFavourites()}>Show Favourites</button>
            </div>

            <div className="app-page-details">
                {
                    uiArray.map((obj) => (
                        <div className="app-page-details-ind" key={obj.id}>
                            <h3>{obj.name}</h3>
                            <p>Duration : {convertSectoMins(obj.durationSeconds)} Minutes</p>
                            <p>start time : {convertDate(obj.startTimeSeconds)}</p>
                            <p>Type: {obj.type}</p>
                        </div>
                    ))
                }
            </div>

            <div className="app-page-pagination">
                <select id="dropdown" onChange={handlePageSizeChange}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <button onClick={previousPage}>Previous</button>
                <button onClick={nextPage}>Next</button>
                
            </div>
            
        </div> : <h3>NO CONTEST FOUND!</h3>}

    </div> 
  );
}

export default App;
