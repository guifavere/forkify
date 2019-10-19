import axios from 'axios'

async function getResults(query) {
    const key = 'b2b0debb84bed3887b3013a454442d65'

    try {
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`)
        const recipes = res.data.recipes

        console.log(recipes)
    } catch (error) {
        alert(error)
    }
}

getResults('tomato pasta')
