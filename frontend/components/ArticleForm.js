import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm({
  postArticle,
  updateArticle,
  setCurrentArticleId,
  currentArticle
}) {
  const [values, setValues] = useState(initialFormValues)
  

  useEffect(() => {
    if (currentArticle) {
      const { title, text, topic } = currentArticle
      setValues({ title, text, topic })
    } else {
      setValues(initialFormValues)
    }
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
  }, [currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    if (currentArticle) {
      updateArticle({
        article_id: currentArticle.article_id,
        article: {
          title: values.title,
          text: values.text,
          topic: values.topic
        }
      })
      .then(() => {
        setValues(initialFormValues)
      })
    } else {
      postArticle(values)
      .then(() => {
        setValues(initialFormValues)
      })
    }
  }

  const isDisabled = () => {
    const { title, text, topic } = values
    return !(
      title.trim().length &&
      text.trim().length &&
      topic.trim().length
    )
  }

  const cancelEdit = evt => {
    evt.preventDefault()
    setCurrentArticleId(null)
    setValues(initialFormValues)
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? 'Edit' : 'Create'} Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={Function.prototype}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
