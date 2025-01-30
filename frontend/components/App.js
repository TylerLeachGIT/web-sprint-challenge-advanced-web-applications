import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [username, setUsername] = useState('')

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate('/')
  }
  const redirectToArticles = () => {
    navigate('/articles')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    setUsername('')
    setMessage('Goodbye!')
    redirectToLogin()
  }
  
  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
  
    axios.post(loginUrl, { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token)
        setUsername(username) // Save username
        return getArticles()
      })
      .then(() => {
        redirectToArticles()
      })
      .catch(err => {
        setMessage(err.response?.data?.message || 'Something went wrong')
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const getArticles = () => {
    console.log('getArticles called')
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
  
    axios.get(articlesUrl, {
      headers: { Authorization: token }
    })
      .then(res => {
        const articleData = Array.isArray(res.data) ? res.data : res.data.articles || []
        setArticles(articleData)
        setMessage(`Here are your articles, ${username}!`)
        return articleData
      })
      .catch(err => {
        console.error('Articles error:', err.response)
        if (err.response?.status === 401) {
          redirectToLogin()
        }
        setMessage(err.response?.data?.message || 'Something went wrong')
        throw err
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
  
    return axios.post(articlesUrl, article, {
      headers: { Authorization: token }
    })
      .then(res => {
        setArticles(prev => [...prev, res.data.article])
        setMessage(`Well done, ${username}. Great article!`)
        setCurrentArticleId(null)
      })
      .catch(err => {
        if (err.response?.status === 401) {
          redirectToLogin()
        }
        setMessage(err.response?.data?.message || 'Something went wrong')
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    setMessage('')
    setSpinnerOn(true)
    const token = localStorage.getItem('token')

    return axios.put(`${articlesUrl}/${article_id}`, article, {
      headers: { Authorization: token }
    })
    .then(res => {
      const updatedArticle = {
        ...article,
        article_id
      }

      setArticles(prevArticles => 
        prevArticles.map(art => 
          art.article_id === article_id ? updatedArticle : art
        )
      )
      setCurrentArticleId(null)
      setMessage(`Nice update, ${username}!`)
    })
    .catch(err => {
      console.log('Update error:', err.response)
      if (err.response?.status === 401) {
        redirectToLogin()
      }
      setMessage(err.response?.data?.message || 'Something went wrong')
      throw err
    })
    .finally(() => {
      setSpinnerOn(false)
    })
  }

  const deleteArticle = article_id => {
    setMessage('')
    setSpinnerOn(true)

    const token = localStorage.getItem('token')

    axios.delete(`${articlesUrl}/${article_id}`, {
      headers: { Authorization: token }
    })
    .then(() => {
      setArticles(articles.filter(art => art.article_id !== article_id))
      setMessage(`Article ${article_id} was deleted, ${username}!`)
    })
    .catch(err => {
      if (err.response?.status === 401) {
        redirectToLogin()
      }
      setMessage(err.response?.data?.message || 'Something went wrong')
    })
    .finally(() => {
      setSpinnerOn(false)
    })
  }

  console.log(typeof articles, Array.isArray(articles))

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm
              postArticle={postArticle}
              updateArticle={updateArticle}
              setCurrentArticleId={setCurrentArticleId}
              currentArticle={Array.isArray(articles) ? articles.find(art => art.article_id === currentArticleId) : null}
               />
              <Articles
              articles={Array.isArray(articles) ? articles : []}
              getArticles={getArticles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              currentArticleId={currentArticleId}
               />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}

const cancelEdit = evt => {
  evt.preventDefault()
  setCurrentArticleId(null)
  setValues(initialFormValue)
}

<button onClick={cancelEdit}>Cancel edit</button>
