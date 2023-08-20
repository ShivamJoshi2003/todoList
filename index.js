import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up express-session
app.use(
    session({
        secret: "mysecretkey",
        resave: false,
        saveUninitialized: true,
    })
);

mongoose.connect("mongodb+srv://Shivam:vivalasvegas@cluster0.zbmxiv0.mongodb.net/questsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const questsSchema = mongoose.Schema({
    quest: String,
    completed: Boolean,
    category: String, // Add this field
});


const Quests = mongoose.model("Quests", questsSchema);

const port = 3000;

app.get('/', async (req, res) => {
    try {
        const quests = await Quests.find({ category: 'daily' });
        res.render('index.ejs', {
            quests: quests || [], // Use quests from the database or empty array if not available
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/work', async (req, res) => {
    try {
        const workQuests = await Quests.find({ category: 'work' });
        res.render('work.ejs', {
            quests: workQuests || [], // Use workQuests from the database or empty array if not available
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/add', async (req, res) => {
    const quest = req.body.quest;
    try {
        await Quests.create({
            quest: quest,
            completed: false,
            category: 'daily',
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/delete', async (req, res) => {
    const indexToRemove = req.body.index;

    try {
        const fin = await Quests.find({ category: 'daily' });
        if(indexToRemove >= 0 && indexToRemove < fin.length) {
            const del = fin[indexToRemove]._id;
            await Quests.findByIdAndDelete(del);
        }
        
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/work/add', async (req, res) => {
    const quest = req.body.quest;
    try {
        await Quests.create({
            quest: quest,
            completed: false,
            category: 'work',
        });
        res.redirect('/work');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/work/delete', async (req, res) => {
    const indexToRemove = req.body.index;
    try {
        const fin = await Quests.find({ category: 'work' });
        if(indexToRemove>=0 && indexToRemove < fin.length)  {
            const del = fin[indexToRemove]._id;
            await Quests.findByIdAndDelete(del);
        }
        
        res.redirect('/work');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/update/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const completed = req.query.completed === 'true';

    try {
        await Quests.findByIdAndUpdate(taskId, { completed: completed });
        res.status(200).send('Task updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(process.env.PORT || port, () => {
    console.log(`server is running on port ${port}.`);
});
