import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of the app
 * - search object
 * - current recipe object
 * - shopping list object
 * - liked recipes
 */
const state = {}

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1. get the query of the view
    const query = searchView.getInput()

    if (query) {
        // 2. new search object and add to state
        state.search = new Search(query)

        // 3. prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchRes)

        try {
            // 4. search for recipes
            await state.search.getResults()

            // 5. render results on UI
            clearLoader()
            searchView.renderResults(state.search.result)
        } catch (err) {
            alert('Something wrong with the search...')
            clearLoader()
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch()
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10)

        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
})

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // get the id from url
    const id = window.location.hash.replace('#', '')

    if (id) {
        // prepare UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        // highlight selected search item
        if (state.search) searchView.highlightSelected(id)

        // create new recipe object
        state.recipe = new Recipe(id)

        try {
            // get recipe data and parse ingredients
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()

            // calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()

            // render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe)
        } catch (err) {
            alert('Error processing recipe!')
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // create a new list if there is none yet
    if (!state.list) state.list = new List()

    // add each ingredient to the list, and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)

        listView.renderItem(item)
    })
}

// handling delete and update item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid

    // handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id)

        // delete from UI
        listView.deleteItem(id)
    // handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value)

        state.list.updateCount(id, val)
    }
})

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList()
    }
})
