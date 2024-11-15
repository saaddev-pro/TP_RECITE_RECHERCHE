import React, { StrictMode, useState } from 'react';



// Composant RecipeCard
const RecipeCard = ({ recipe }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full" src={recipe.image} alt={recipe.label} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{recipe.label}</div>
        <p className="text-gray-700 text-base">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient.text}</li>
          ))}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Calories : {Math.round(recipe.calories)} | Temps : {recipe.totalTime || 'N/A'} min
        </p>
      </div>
    </div>
  );
};




// Composant principal App
function App() {
  
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const APP_ID = '9273cc99'; // Remplacez par votre ID API
  const APP_KEY = '4ec76102e381a7a0704ff0c9679cb4bd'; // Remplacez par votre clé API
  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        `https://api.edamam.com/search?q=${search}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      if (!response.ok) throw new Error('Erreur lors de la récupération des données');
      const data = await response.json();
      setRecipes(data.hits.map(hit => hit.recipe));
    } catch (error) {
      console.error(error);
      setRecipes([]);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== '') fetchRecipes();
  };

  const handleSort = (criteria) => {
    const sortedRecipes = [...recipes];
    if (criteria === 'calories') {
      sortedRecipes.sort((a, b) => a.calories - b.calories);
    } else if (criteria === 'time') {
      sortedRecipes.sort((a, b) => (a.totalTime || 0) - (b.totalTime || 0));
    }
    setRecipes(sortedRecipes);
    setSortCriteria(criteria);
  };
  return (
    <div className="App">
    <form onSubmit={handleSearch} className="m-4 flex justify-center">

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher une recette..."
        className="border-2 border-gray-300 rounded p-2 mr-2 w-1/2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Rechercher
      </button>
    </form>
    <div className="flex justify-center space-x-4 m-4">
      <button
        onClick={() => handleSort('calories')}
        className={`p-2 rounded ${sortCriteria === 'calories' ? 'bg-green-500' : 'bg-gray-200'} hover:bg-green-400`}
      >
        Trier par Calories
      </button>
      <button
        onClick={() => handleSort('time')}
        className={`p-2 rounded ${sortCriteria === 'time' ? 'bg-green-500' : 'bg-gray-200'} hover:bg-green-400`}
      >
        Trier par Temps
      </button>
    </div>
    {recipes.length === 0 && search && (
      <p className="text-center text-red-500">Aucune recette trouvée.</p>
    )}
    <div className="grid grid-cols-3 gap-4 p-4">
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  </div>
);
}

export default App;



