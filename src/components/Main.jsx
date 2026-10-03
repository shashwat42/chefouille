import React from 'react'
import ReactMarkdown from 'react-markdown'
import RecipeGenerator from './GetRecipe.jsx'

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState('')
    const [generationVersion, setGenerationVersion] = React.useState(0)
    const currentGenerationVersion = React.useRef(0)

    const removeIngredient = (ingredientIndex) => {
        currentGenerationVersion.current += 1
        setGenerationVersion(currentGenerationVersion.current)
        setRecipe('')
        setIngredients(currentIngredients =>
            currentIngredients.filter((_, index) => index !== ingredientIndex)
        )
    }

    const ingredientsArray = ingredients.map((ingredient, index) => (
        <li className="ingredient-item" key={`${ingredient}-${index}`}>
            <div className="ingredient-row">
                <span>{ingredient}</span>
                <button
                    type="button"
                    className="remove-ingredient-button"
                    aria-label={`Remove ${ingredient}`}
                    title={`Remove ${ingredient}`}
                    onClick={() => removeIngredient(index)}
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                        <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
                    </svg>
                </button>
            </div>
        </li>
    ))
    const addIngredient = (formData) => {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
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
        {ingredients.length > 0 && <section className='ingList'>
            <h2>Ingredients on hand: </h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsArray}</ul>
            {ingredients.length >= 4 ? (
                <RecipeGenerator
                    key={generationVersion}
                    ingredients={ingredients}
                    onRecipeGenerated={(generatedRecipe) => {
                        if (currentGenerationVersion.current === generationVersion) {
                            setRecipe(generatedRecipe)
                        }
                    }}
                />
            ) : <p>Please Add Atleast 4 Items</p>}
        </section>}
        {recipe && <section>
            <h2>Chefoille Recommends:</h2>
            <article className="suggested-recipe-container" aria-live="polite">
                <ReactMarkdown>{recipe}</ReactMarkdown>
            </article>
        </section>}
    </main>)
}