import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./Pokemon_Component/PokemonCards";

export const Pokemon = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search,setSearch] = useState("");

    const API = "https://pokeapi.co/api/v2/pokemon?limit=124";

    const fetchPokemon = async()=>{
        try{
            const res = await fetch(API);
            const data = await res.json();

            const detailedPokemonData = data.results.map(async(curPok)=>{
                const res = await fetch(curPok.url);
                const data = await res.json();
                return data;          // ab yaha promises mil rha h jo ki hm directly nhi le skte                
            }) 
            const  detailedResponses = await Promise.all(detailedPokemonData);
            console.log(detailedResponses);
            setPokemon(detailedResponses);
            setLoading(false);
            
        }catch(error){
            // console.log(error);
            setLoading(false);  
            setError(error);
        }
    }

    useEffect(()=>{
        fetchPokemon();
    },[])

    // search functionality
    const searchData = pokemon.filter((curPokemon)=>curPokemon.name.toLowerCase().includes(search.toLowerCase()));

    if(loading){
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }
    if(error){
        return(
            <div>
                <h1>{error.message}</h1>
            </div>
        )
    }
  return <section className="container">
    <header>
        <h1>Lets Find Pokemon</h1>
    </header>
    <div className="pokemon-search">
        <form>
            <input type="text" placeholder="Search Pokemon" value={search} onChange={(event)=>setSearch(event.target.value)} />
        </form>
    </div>
    <div>
        <ul className="cards">
            {
                searchData.map((curPokemon)=>{
                    return <PokemonCards key={curPokemon.id} PokemonData={curPokemon}/>
                })
            }
        </ul>
    </div>
  </section>
};
