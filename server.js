const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });

app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`))
