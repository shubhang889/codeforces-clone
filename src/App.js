import './App.css';
import {RESULT} from './constant';
import {useEffect, useState} from 'react';

let pages=0 ;

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

function previousPage() {
    // pages = pages>0 ? pages-1 : pages ;
    return ;
}

function nextPage() {
    // pages+=1;
    return ;
}

function App() {
   useEffect(() => {
       console.log(RESULT);
       return () => {
           
       }
   }, []);

   const[query, setQuery] = useState("") ;
   
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
        <div className="app-page">
            <div className="App-page-Dropdown-Search">
                <input placeholder="Search" onChange={event => setQuery(event.target.value)} />
                <select id="dropdown">
                    <option value="CF">CF</option>
                    <option value="IOI">IOI</option>
                    <option value="ICPC">ICPC</option>
                </select>
                <button onClick={filterFavourites()}>Show Favourites</button>
            </div>

            <div className="app-page-details">
                {
                    RESULT.filter(obj => {
                        if (query === '') {
                            return obj;
                        } 
                        else if (obj.name.toLowerCase().includes(query.toLowerCase())) {
                            return obj;
                        }
                    }).map((obj) => (
                        <div className="app-page-details-ind" key={obj.id}>
                            <h3>{obj.name}</h3>
                            <p>Duration : {convertSectoMins(obj.durationSeconds)} Minutes</p>
                            <p>start time : {convertDate(obj.startTimeSeconds)}</p>
                        </div>
                    ))
                }
            </div>

            <div className="app-page-pagination">
                <select id="dropdown">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <button onclick="previousPage()">Previous</button>
                <button onclick="nextPage()">Next</button>
                
            </div>
            
        </div>

    </div>
  );
}

export default App;
