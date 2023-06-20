import { useEffect, useState } from 'react'
import { IComment, IData } from './modules'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<IComment[]>([])
  const [textarea, setTextarea] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/comments?limit=3')
        const json: IData = await response.json()
        setComments(json.comments)
        setIsLoading(false)
      } catch (error) {
        console.log('error', error)
      }
    }
    fetchData()
    const text = JSON.parse(localStorage.getItem('text') || JSON.stringify(''))
    if (text) {
      setTextarea(text)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('text', JSON.stringify(textarea))
  }, [textarea])

  const addComment = () => {
    fetch('https://dummyjson.com/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: textarea,
        postId: 3,
        userId: 5,
      }),
    })
      .then(res => res.json())
      .then(console.log)

    setComments([
      ...comments,
      {
        id: comments.length + 1,
        body: textarea,
        postId: 3,
        user: {
          id: 5,
          username: 'New User',
        },
      },
    ])

    setTextarea('')
  }

  const deleteComment = (id: number) => {
    fetch(`https://dummyjson.com/comments/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(console.log)

    setComments(comments.filter(item => item.id !== id))
  }

  return (
    <div className='App'>
      <div className='container'>
        <div className='content'>
          {!isLoading &&
            comments.map(item => (
              <div key={item.id} className='item'>
                <div className='item__header'>
                  <div className='item__header_logo'>
                    {item.user.username
                      .split(' ')
                      .map(el => `${el.slice(0, 1).toUpperCase()}`)
                      .join('')}
                  </div>
                  <div className='item__header_name'>{item.user.username}</div>
                </div>
                <div className='item__body'>{item.body}</div>
                <span
                  onClick={() => deleteComment(item.id)}
                  className='item__button'
                >
                  <p>x</p>
                </span>
              </div>
            ))}
          <form className='field'>
            <textarea
              maxLength={300}
              className='field__input'
              onChange={e => setTextarea(e.target.value)}
              value={textarea}
            ></textarea>
            <button
              disabled={textarea.length === 0}
              type='button'
              onClick={addComment}
              className='field__button'
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
