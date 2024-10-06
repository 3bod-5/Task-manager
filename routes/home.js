const express = require('express');
const router = express.Router(); // Use `router` to define a router module
const collection = require('../models/user'); // Ensure this points to your User model
const bodyParser = require('body-parser');
const session = require('express-session');

// Middleware for session management
router.use(session({ secret: "Your secret key", saveUninitialized: false, resave: false }));

// Middleware to serve static files
router.use(express.static("views"));
router.use(express.static('public'));

// Middleware to parse the request body
router.use(bodyParser.urlencoded({ extended: true }));

// Render the home page
router.get('/', async (req, res) => {
    try {
        const userName = req.session.user.name;

        // Fetch the user object from the database
        const valid = await collection.findOne({ name: userName });

        // Ensure the user and tasks exist
        if (!valid || !valid.tasks) {
            return res.status(404).send('User or tasks not found');
        }

        const tasks = valid.tasks;

        // Filter out the completed tasks
        const completedTasks = tasks.filter(task => task.completed);

        // Render the home page with tasks and completed tasks
        res.render('home', { tasks: tasks, completedTasks: completedTasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Handle form submission to search for a user
router.post('/addtask', async (req, res) => {
    const currentUserId = req.session.user ? req.session.user.userId : null;
    
    if (!currentUserId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        // Find the current user object in the database
        const user = await collection.findOne({ name:req.session.user.name});

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Create a new task object
        const newTask = {
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline
        };

        // Push the new task to the user's tasks array
        user.tasks.push(newTask);

        // Save the updated user object back to the database
        await collection.updateOne(
            { name: user.name }, // Find the user by userId
            { $set: { tasks: user.tasks } } // Update the tasks array
        );
        console.log(newTask)

        // Redirect back to home or tasks page
        res.redirect(`/home`);
    } catch (error) {
        console.error('Error adding task:', error)
        res.status(500).send('Internal Server Error');
    }
});


/*i want the user to delete a specific task */
router.get('/delete/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const userName = req.session.user.name;

        // Find the user by name
        const user = await collection.findOne({ name: userName });

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Ensure the user has tasks and remove the task by id
        user.tasks = user.tasks.filter(task => task._id.toString() !== taskId);

        // Update the user's tasks in the database
        await collection.updateOne(
            { name: userName }, 
            { $set: { tasks: user.tasks } }
        );

        console.log("Deleted task successfully");
        res.redirect(`/home`);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while deleting the task.");
    }
});
router.post('/complete/:id', async (req, res) => {
    try {
        const userName = req.session.user.name;
        const taskId = req.params.id;

        // Find the user and mark the task as complete
        await collection.updateOne(
            { name: userName, 'tasks._id': taskId },
            { $set: { 'tasks.$.completed': true } } // Mark the task as completed
        );

        res.redirect('/home');
    } catch (error) {
        console.error('Error marking task as complete:', error);
        res.status(500).send('Internal Server Error');
    }
});





module.exports = router;
