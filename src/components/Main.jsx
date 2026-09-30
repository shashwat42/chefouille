import React from 'react'
export default function Main() {
    const [ingredients, setIngredients] = React.useState([])

    const newArray = ingredients.map(data => (
        <li key={data}> {data} </li>
    ))
    const onSubmitHandler = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const newIngredient = formData.get("ingredient")

        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
        console.log(ingredients)
    }

    return (<main>
        <form onSubmit={onSubmitHandler} className="add-ingredient-form">
            <input aria-label="Add ingredient"
                type="text"
                placeholder="Oregano"
                name="ingredient"
            />
            <button>Add ingredient</button>
        </form>
        <ul>
            {newArray}
        </ul>
    </main>)
}