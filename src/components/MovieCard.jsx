import React from 'react';

function MovieCard({ movie: { title, vote_average, poster_path, release_date, original_language } }) {
    return (
        <div className="movie-card">
            {poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={title} />
            ) : (
                <img src="https://image.tmdb.org/t/p/w500/no-movie.png" alt="No movie available" />
            )}
            <div className='mt-4'>
                <h3>{title}</h3>
                <div className='content'>
                    <div className='rating'>
                         <img src="star.png" alt="Star Icon" />
                         {vote_average?
                         (
                            <p>{vote_average.toFixed(1)}</p>
                         ):(
                            <p>N/A</p>
                         )}
                    </div>
                    <span>⦁</span>
                    <p className='lang'>{original_language}</p>
                    <span>⦁</span>
                    {release_date?(
                    <p className='year'>{release_date.split('-')[0]}</p>):(<p className='year'>N/A</p>)}
                </div>
            </div>
        </div>
    );
}

export default MovieCard;
