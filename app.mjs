import 'dotenv/config';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import documents from "./docs.mjs";

const port = process.env.PORT;
const app = express();

app.disable('x-powered-by');
app.set("view engine", "ejs");
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.get("/new", (req, res) => {
    res.render("new", { doc: {} });
});

app.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);
    return res.redirect(`/${result.lastID}`);
});

app.post("/update", async (req, res) => {
    const result = await documents.updateOne(req.body);
    return res.redirect(`/${req.body.id}`);
});

app.get('/:id', async (req, res) => {
    return res.render("doc", { doc: await documents.getOne(req.params.id) });
});

app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
