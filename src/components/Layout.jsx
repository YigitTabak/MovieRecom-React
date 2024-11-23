import React, {  useRef,useEffect,useState } from "react";
import "./Layout.css"


const Layout = () => {
    const inputRef=useRef()
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [movieid, setmovieid] = useState("");

      const fetchMovieId = async (moviename) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?query=${moviename}&include_adult=false&language=en-US&page=1`, 
                {
                    headers: {
                        Authorization: ` Bearer ${import.meta.env.VITE_APP_ID}`,
                        accept: 'accept: application/json'
                    }    
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const moviedata = await response.json();
            console.log(moviedata);
            console.log("Filmin ID'si: ", moviedata.results[0].id);
 
            if (moviedata.results && moviedata.results.length > 0) {
                const fetchedMovieId = moviedata.results[0].id;
                setmovieid(fetchedMovieId);
                await fetchRecommendations(fetchedMovieId); 
            } else {
                setError("Film bulunamadı.");
            }
            
            
        } catch (error) {
            console.error("Fetch error: ", error); 
        } finally {
            setLoading(false); 
        }      
    };

      const fetchRecommendations = async (movieid) => {
        setLoading(true); 
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movieid}/recommendations?language=en-US&page=1`, 
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_APP_ID}`,
                        accept: 'application/json'
                    }
                    
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data);
            console.log("Önerilen film: ", data.results[0].title);
            setRecommendations(data.results.slice(0, 12))
            
        } catch (error) {
            console.error("Fetch error: ", error); 
        } finally {
            setLoading(false); 
        }
    };
    


    return(
 <>
    <div className="header">
        <div className="baslik">
            <h1>Film Öneri</h1>
        </div>     
   </div>

   <div id="main">
        <div className="box2">
                
            <div className="question">
                <h2 className="yazi">Sevdiğin Filmi Yaz Benzerlerini Önerelim</h2> <br></br>
                <input ref={inputRef} type="text" placeholder="Film İsmini Yazınız" />
                <button id="onerbutton" onClick={()=>fetchMovieId(inputRef.current.value)}>Öner</button>
            </div>

                <div className="recomfilmlist">
                {recommendations.map((film, index) => (
                    <div className="film-item" key={index}>
                        <img src={`https://image.tmdb.org/t/p/w500${film.poster_path}`} alt={film.original_title} />
                        <p>{film.original_title}</p>
                    </div>
                    ))}

                </div>
                    
            </div>
   </div>
 </>
    );
}
export default Layout

