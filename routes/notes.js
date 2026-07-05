const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');


// ROUTE-1 get all the Notes of user using GET "/api/notes/getuser".  login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
   try {
      const notes = await Notes.find({ user: req.user.id })
      res.json(notes)
   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occur!");
   }
})

// ROUTE-2  add Notes of user using POST "/api/notes/addnote".  login required
router.post('/addnote', fetchuser,
   [
      body('title', 'Enter a Valid title').isLength({ min: 3 }),
      body('description', 'description must be atleast 5 character').isLength({ min: 6 }),
   ], async (req, res) => {
      try {
         const { title, description, tag } = req.body;
         // if there are error return bad request or error
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }

         const notes = new Notes({
            title, description, tag, user: req.user.id
         })
         const savedNote = await notes.save()
         res.json(savedNote)
      } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal Server Error Occur!");
      }
   })

// ROUTE-3  Update Notes of user using PUT "/api/notes/updatenote".  login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
   const { title, description, tag } = req.body;
   try {
      const newNote = {};
      if (title) { newNote.title = title };
      if (description) { newNote.description = description };
      if (tag) { newNote.tag = tag };

      // find the note  to be updated
      let note = await Notes.findById(req.params.id);
      if (!note) {
         return res.status(404).send('Not FOund')
      }
      if (note.user.toString() !== req.user.id) {
         return res.status(401).send('Not Allowed')
      }
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
      res.json({ note });
   } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occur!");
   }
})

// ROUTE-4  Delete Notes of user using DELETE "/api/notes/updatenote".  login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
   const { title, description, tag } = req.body;
   try {
      const newNote = {};
      if (title) { newNote.title = title };
      if (description) { newNote.description = description };
      if (tag) { newNote.tag = tag };

      // find the note  to be updated and deleted
      let note = await Notes.findById(req.params.id);
      if (!note) {
         return res.status(404).send('Not FOund')
      }
      // Allo deletion when user onw this notes
      if (note.user.toString() !== req.user.id) {
         return res.status(401).send('Not Allowed')
      }
      note = await Notes.findByIdAndDelete(req.params.id)
      res.json({ "Succecc": "Note has been deleted", note: note });
   }
   catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occur!");
   }
})

module.exports = router