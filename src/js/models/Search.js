import axios from 'axios'

export default class Search {
    constructor(query) {
        this.query = query
    }

    async getResults() {
        const key = 'b2b0debb84bed3887b3013a454442d65'

        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`)

            this.result = res.data.recipes
        } catch (error) {
            alert(error)
        }
    }
}