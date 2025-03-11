import { useState, useEffect } from "react";
import pizzaJson from "./assets/pizzalist.json";
import ingredientsJson from "./assets/ingredientslist.json";
import "./assets/common.scss";
import "./App.css";

function App() {
  const [currentIngredients, setCurrentIngredients] = useState([]);
  let pizzaList = Object.keys(pizzaJson);
  let ingredientsCategories = Object.keys(ingredientsJson);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  const [shuffledPizzas, setShuffledPizzas] = useState(shuffle(pizzaList));
  const [pizzaProgress, setPizzaProgress] = useState(0);
  const [currentPizza, setCurrentPizza] = useState(
    shuffledPizzas[pizzaProgress],
  );
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    console.log("shuffled pizzas", shuffledPizzas);
    console.log(pizzaProgress);
    console.log(currentPizza);
    setCurrentPizza(shuffledPizzas[pizzaProgress]);
  }, [pizzaProgress]);

  function ingredientHandler(ingredient) {
    if (currentIngredients.includes(ingredient)) {
      const cI = currentIngredients.filter((item) => item !== ingredient);
      setCurrentIngredients(cI);
      console.log(cI);
      console.log("removed", ingredient);
    } else {
      setCurrentIngredients((prev) => [...prev, ingredient]);
      console.log("added", ingredient);
    }
  }
  function submitHandler() {
    function isEqual(a, b) {
      return (
        a.length === b.length &&
        a.every((element) => b.includes(element)) &&
        b.every((element) => a.includes(element))
      );
    }
    console.log("submit");
    if (isEqual(currentIngredients, pizzaJson[currentPizza])) {
      setLastResult("match");
      console.log("match");
    } else {
      setLastResult("no match");
      console.log("no match");
    }
    setCurrentIngredients([]);
    let p = pizzaProgress + 1;
    setPizzaProgress(p);
  }

  return (
    <>
      {lastResult ? (
        <div className={`last-pizza ${lastResult.replace(" ", "-")}`}>
          <p>Last Pizza: {shuffledPizzas[pizzaProgress - 1]}</p>
          <p>{lastResult}</p>
        </div>
      ) : (
        <h1>MOD</h1>
      )}
      <hr />
      <h2>{currentPizza}</h2>
      <div className="current-ingredients">
        <ul className="current-ingredients-list">
          {currentIngredients.map((ingredient) => {
            return <li>{ingredient}</li>;
          })}
        </ul>
        <button
          onClick={() => {
            submitHandler();
          }}
        >
          SUBMIT
        </button>
      </div>
      <hr />
      <div className="ingredients-wrapper">
        {ingredientsCategories.map((item) => {
          return (
            <div className="ingredients-column">
              {ingredientsJson[item].map((ingredient) => {
                return (
                  <button
                    value={ingredient}
                    onClick={() => {
                      ingredientHandler(ingredient);
                    }}
                    className={
                      currentIngredients.includes(ingredient) ? "active" : ""
                    }
                  >
                    {ingredient}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
