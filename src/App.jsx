import { useState, useEffect } from "react";
import pizzaJson from "./assets/pizzalist.json";
import saladJson from "./assets/saladlist.json";
import ingredientsJson from "./assets/ingredientslist.json";
import "./assets/common.scss";
import "./App.css";

function App() {
  const [currentIngredients, setCurrentIngredients] = useState([]);
  let pizzas = Object.keys(pizzaJson);
  let salads = Object.keys(saladJson);
  let pizzaList = pizzas.concat(salads);
  let ingredientsCategories = Object.keys(ingredientsJson);
  let combineJson = Object.assign(pizzaJson, saladJson);
  console.log("combineJson", combineJson);
  console.log("saladJson", saladJson);

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
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPizza(shuffledPizzas[pizzaProgress]);
  }, [pizzaProgress, shuffledPizzas]);

  // Handler definitions for selecting ingredients and submitting lists
  function ingredientHandler(ingredient) {
    if (currentIngredients.includes(ingredient)) {
      const cI = currentIngredients.filter((item) => item !== ingredient);
      setCurrentIngredients(cI);
      console.log("removed", ingredient);
    } else {
      setCurrentIngredients((prev) => [...prev, ingredient]);
      console.log("added", ingredient);
    }
  }

  function submitHandler() {
    function isEqual(a, b) {
      console.log(
        "😎",
        a.length === b.length &&
          a.every((element) => b.includes(element)) &&
          b.every((element) => a.includes(element)),
      );
      return (
        a.length === b.length &&
        a.every((element) => b.includes(element)) &&
        b.every((element) => a.includes(element))
      );
    }
    console.log("submit");
    if (isEqual(currentIngredients, combineJson[currentPizza])) {
      setLastResult("match");
      setPizzaScore(pizzaScore + 1);
      console.log("match");
      //} else if (isEqual(currentIngredients, saladJson[currentPizza])) {
      //  setLastResult("match");
      //  setPizzaScore(pizzaScore + 1);
      //  console.log("match");
    } else {
      setLastResult("no match");
      console.log("no match");
    }
    setCurrentIngredients([]);
    let p = pizzaProgress + 1;
    setPizzaProgress(p);
    handleModalOpen();
  }

  function handleModalOpen() {
    if (modalOpen) {
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }
  }

  // Component parts to refactor out:
  function StatusBar() {
    return (
      <div className={`status-bar ${lastResult.replace(" ", "-")}`}>
        <p>
          {lastResult == "match" ? "✔" : "❌"}
          {lastResult}
        </p>
        <p>score: {pizzaScore}</p>
      </div>
    );
  }

  function CurrentIngredientsList() {
    return (
      <div className="current-ingredients">
        <ul className="current-ingredients-list">
          {currentIngredients.map((ingredient) => {
            return (
              <li onClick={() => ingredientHandler(ingredient)}>
                {ingredient}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  function LastPizza() {
    return (
      <div className={`last-pizza ${lastResult.replace(" ", "-")}`}>
        <p>
          {lastResult == "match" ? "✔" : "❌"}
          {lastResult}
        </p>
        <ul>
          {combineJson[shuffledPizzas[pizzaProgress - 1]].map((ingredient) => {
            return <li>{ingredient}</li>;
          })}
        </ul>
      </div>
    );
  }
  function CurrentPrompt() {
    return (
      <div className="current-prompt-wrapper">
        <button
          className="submit-button"
          onClick={() => {
            submitHandler();
          }}
        >
          SUBMIT
        </button>
      </div>
    );
  }

  function IngredientSelect() {
    return (
      <div className="ingredients-wrapper">
        {ingredientsCategories.map((item) => {
          return ingredientsJson[item].map((ingredient) => {
            return (
              <button
                key={"ingredient-" + item + "-" + ingredient}
                value={item + "-" + ingredient}
                onClick={() => {
                  ingredientHandler(ingredient);
                }}
                className={
                  item.replace(" ", "") +
                  " " +
                  (currentIngredients.includes(ingredient) ? "active" : "")
                }
              >
                {ingredient}
              </button>
            );
          });
        })}
      </div>
    );
  }
  function TopBar() {
    return (
      <div className="sticky-bar">
        <div className="pizza-title">
          <div className="pizza-name">
            {
              //<img
              //  className="mod-logo-header"
              //  src="/mod_pizza_game/public/MOD_Pizza_logo.svg.png"
              ///>
            }
            <h1>{currentPizza}</h1>
          </div>
          <h3>
            {pizzaProgress + 1} / {pizzaList.length}
          </h3>
        </div>
        <CurrentIngredientsList />
        <div className="submit-button-wrapper">
          <button
            className="submit-button"
            onClick={() => {
              submitHandler();
            }}
          >
            SUBMIT
          </button>
        </div>
        {lastResult ? <StatusBar /> : ""}
      </div>
    );
  }

  function ModalElement({ title, children }) {
    console.log("title", title);
    if (modalOpen) {
      return (
        <div className="modal-wrapper" onClick={() => handleModalOpen()}>
          <div className="modal-body">
            <div className="modal-header">
              <h2>{title}</h2>
              <span className="close" onClick={() => handleModalOpen()}>
                X
              </span>
            </div>
            <div className="modal-inner">{children}</div>
          </div>
        </div>
      );
    }
  }

  function GameOver() {
    return (
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
    );
  }

  return (
    <>
      <TopBar />
      {lastResult ? (
        <>
          <ModalElement title={shuffledPizzas[pizzaProgress - 1]}>
            <LastPizza />
          </ModalElement>
        </>
      ) : (
        <img
          className="mod-logo"
          src="/mod_pizza_game/public/MOD_Pizza_logo.svg.png"
        />
      )}
      {pizzaProgress < pizzaList.length ? (
        <>
          <hr />
          <IngredientSelect />
        </>
      ) : (
        <GameOver />
      )}
    </>
  );
}

export default App;
