const express = require('express');
const axios = require('axios'); // Axios pour les requêtes HTTP

const app = express();
app.use(express.static(__dirname));


app.get('/search', async (req, res) => {
    const query = req.query.q || '';
    const category = req.query.category || '';

    try {
        const searchQuery = {
            query: query
                ? {
                    bool: {
                        must: [
                            { multi_match: { query, fields: ['title', 'author'] } }
                        ],
                        filter: category ? [{ term: { category } }] : []
                    }
                }
                : { match_all: {} },
        };

        const response = await axios.post('http://localhost:9200/books/_search', searchQuery);

        const hits = response.data.hits?.hits || [];
        res.json(hits);
    } catch (err) {
        console.error('Error querying Elasticsearch:', err.message || err);
        res.status(500).send(`Error querying Elasticsearch: ${err.message}`);
    }
});



const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));















