const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const app = express();
app.use(express.static('dist'));
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.get('/',(req,res)=>
{
	res.send('<h1>Hello World</h1>')
})

app.get('/api/notes',(req,res)=>
{
	res.json(notes);
})

app.post('/api/notes',(req,res)=>{
  const maxId = notes.length > 0
                ? Math.max(...notes.map(note=>note.id))
                : 0;
  const newId = maxId + 1;

  const content = req.body.content;

  if(content)
  {
    const note = {
      id: newId,
      content: content,
      important: false
    }
    notes.push(note)
    res.send(note)
  }
  else
  {
    res.status(404).json({"Error":"Missing content."})
  }
})

app.get('/api/notes/note=:id',(req,res)=>
{
	const id = req.params.id;
	const note = notes.find(note=>note.id==id) 
	if(note)
	{
		res.json(note)
	}
	else
	{
		res.status(404).send(`<h1>Failed to get note with id ${id}</h1>`)
	}
})

app.delete('/api/notes/note=:id',(req,res)=>
{
	const id = Number(req.params.id);
	notes = notes.filter(note=>note.id!==id);
	res.status(204).end()
})

const PORT = process.env.PORT||3030;
app.listen(PORT, ()=>{console.log('Server running on port',PORT);});
