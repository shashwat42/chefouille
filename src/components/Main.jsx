import React from 'react'
export default function Main() {
    const [ingredients, setIngredients] = React.useState([])

    const ingredientsArray = ingredients.map(data => (
        <li key={data}> {data} </li>
    ))
    const addIngredient = (formData) => {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
        console.log(ingredients)

    }

    return (<main>
        <form action={addIngredient} className="add-ingredient-form">
            <input aria-label="Add ingredient"
                type="text"
                placeholder="Oregano"
                name="ingredient"
            />
            <button>Add ingredient</button>
        </form>
        {ingredients.length > 0 && <section>
            <h2>Ingredients on hand: </h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsArray}</ul>
            {ingredients.length >= 4 && <div className="get-recipe-container">
                <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from you list</p>
                </div>
                <button>Generate</button>
            </div>}
        </section>}
    </main>)
}