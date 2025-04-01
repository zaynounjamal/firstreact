import React from 'react'


function Search({searchTerm,setSearchTerm}) {
    

    return (
        <div className='search'>
            <div>
                <img src="search.png" alt="" />
                <input type="text" placeholder='Search through thousands of movies' value={searchTerm}
                 onChange={(event)=>setSearchTerm(event.target.value)}/>
            </div>
        </div>
    )
}
export default Search
