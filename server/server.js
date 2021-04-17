const express = require('express');
const cors = require('cors')


const app = express();
app.use(cors())
app.use(express.json());

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));