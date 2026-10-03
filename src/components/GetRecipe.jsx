import React from 'react'

const API_URL = 'https://router.huggingface.co/v1/chat/completions'
const MODEL = 'openai/gpt-oss-120b'
const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients.

Format the recipe in simple Markdown. Never use a table. In particular, present the ingredients as a simple bulleted list, with quantities where appropriate. Present the cooking steps as a numbered list.`

export default function RecipeGenerator({ ingredients, onRecipeGenerated }) {
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [hasGenerated, setHasGenerated] = React.useState(false)
    const [error, setError] = React.useState('')
    const requestInProgress = React.useRef(false)
    const recipeGenerated = React.useRef(false)

    const generateRecipe = async () => {
        if (requestInProgress.current || recipeGenerated.current) {
            window.alert('Already Generated')
            return
        }

        const apiKey = import.meta.env.VITE_AI_API_KEY
        if (!apiKey) {
            setError('VITE_AI_API_KEY is not configured. Add it to your environment and restart the dev server.')
            return
        }

        requestInProgress.current = true
        setIsGenerating(true)
        setError('')
        onRecipeGenerated('')

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: `Ingredients: ${ingredients.join(', ')}` },
                    ],
                }),
            })

            const result = await response.json()
            if (!response.ok) {
                const apiError = result.error?.message || result.error
                throw new Error(typeof apiError === 'string' ? apiError : `Hugging Face request failed (${response.status})`)
            }

            const recipe = result.choices?.[0]?.message?.content
            if (typeof recipe !== 'string' || !recipe.trim()) {
                throw new Error('Hugging Face returned an empty recipe. Please try again.')
            }

            recipeGenerated.current = true
            setHasGenerated(true)
            onRecipeGenerated(recipe)
        } catch (generationError) {
            setError(generationError.message || 'Could not generate a recipe. Please try again.')
        } finally {
            requestInProgress.current = false
            setIsGenerating(false)
        }
    }

    const resetRecipe = () => {
        recipeGenerated.current = false
        setHasGenerated(false)
        setError('')
        onRecipeGenerated('')
    }

    return (
        <>
            <div className="get-recipe-container">
                <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from your list</p>
                </div>
                <div className="recipe-actions">
                    {hasGenerated ? (
                        <button type="button" onClick={resetRecipe}>
                            Reset
                        </button>
                    ) : (
                        <button type="button" onClick={generateRecipe} disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Generate'}
                        </button>
                    )}
                </div>
            </div>
            {error && <p className="recipe-error" role="alert">{error}</p>}
        </>
    )
}
