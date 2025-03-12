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
  const [pizzaScore, setPizzaScore] = useState(0);
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
      setPizzaScore(pizzaScore + 1);
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
        <>
          <div className={`last-pizza ${lastResult.replace(" ", "-")}`}>
            <p>{lastResult}</p>
            <p>
              score: {pizzaScore}/{pizzaList.length}
            </p>
          </div>
          <div className={`last-pizza ${lastResult.replace(" ", "-")}`}>
            <h4>Last Pizza: {shuffledPizzas[pizzaProgress - 1]}</h4>
            <ul>
              {pizzaJson[shuffledPizzas[pizzaProgress - 1]].map(
                (ingredient) => {
                  return <li>{ingredient}</li>;
                },
              )}
            </ul>
          </div>
        </>
      ) : (
        <img src="/mod_pizza_game/public/MOD_Pizza_logo.svg.png" />
        //<h1>MOD</h1>
      )}
      <hr />
      {pizzaProgress < pizzaList.length ? (
        <>
          <h2>{currentPizza}</h2>
          <h3>
            {pizzaProgress + 1} / {pizzaList.length}
          </h3>
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
              return ingredientsJson[item].map((ingredient) => {
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
              });
            })}
          </div>
        </>
      ) : (
        <>
          <div>
            <h2>Game Over</h2>
          </div>
          <div>
            <h3>Final Score:</h3>
            <h4>
              {pizzaScore}/{pizzaList.length}
            </h4>
          </div>
        </>
      )}
    </>
  );
}

export default App;
