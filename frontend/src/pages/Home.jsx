//Landing page

import { useState, useEffect } from 'react';
import { getRecipes } from '../services/api';

function Home(){
  const[recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () =>{
      try{
        const {data} = await getRecipes();
        setRecipes(data.recipes);
      } catch(error){
        console.error(error);
      }
    };
    fetchRecipes();
  }, []);

  return (
    
      <div>
        {recipes.map(recipe => (
          <p key = {recipe._id}>{recipe.title}</p>
        ))}
      </div>
  );
}

export default Home