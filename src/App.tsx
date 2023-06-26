
// import {useEffect, useState} from 'react'
// import './App.css'

// interface Pokemon {
//   name: string;
// }
// function App() {

//   const [pokemons, setPokemons] = useState([]);

//   useEffect(() => {
//     fetch('https://pokeapi.co/api/v2/pokemon')
//     .then(response => response.json()).then(json => setPokemons(json.results));
//   }, [])

//   return (
//     <div className="App">
//       <div className="list">
//         <ul>
//           {pokemons.map((pokemon) => (
//             <li>{pokemon.name}</li>
//           ))}
//         </ul>


//       </div>
//     </div>
//   )
// }

// export default App




import { useEffect, useState, useRef } from 'react';
import './App.css';

interface Pokemon {
  name: string;
}

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon').then((response) =>
      response.json().then((json) => {
        setPokemons(json.results);
        setNextUrl(json.next);
      })
    );
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextUrl) {
          fetch(nextUrl).then((response) =>
            response.json().then((json) => {
              setPokemons((prevPokemons) => [...prevPokemons, ...json.results]);
              setNextUrl(json.next);
            })
          );
        }
      },
      { rootMargin: '20px' }
    );

    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [nextUrl]);

  return (
    <div className="App">
      <div className="list">
        <ul>
          {pokemons.map((pokemon) => (
            <li key={pokemon.name}>{pokemon.name}</li>
          ))}
        </ul>

        <div ref={loaderRef}>Loading...</div>
      </div>
    </div>
  );
}

export default App;
