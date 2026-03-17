import { useEffect, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function formatUploadDate(value) {
  return new Date(value).toLocaleString()
}

function ResourceUploader({ authToken, currentUser }) {
  const [title, setTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploads, setUploads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadUploads() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/uploads`)

        if (!response.ok) {
          throw new Error('Unable to fetch uploaded files right now.')
        }

        const data = await response.json()

        if (!ignore) {
          setUploads(data)
          setError('')
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadUploads()

    return () => {
      ignore = true
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback('')
    setError('')

    if (!authToken) {
      setError('Login is required before uploading files.')
      return
    }

    if (!selectedFile) {
      setError('Choose a file before uploading.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', selectedFile)

    setIsUploading(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/uploads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed.')
      }

      setUploads((currentUploads) => [data, ...currentUploads])
      setFeedback('File uploaded successfully.')
      setTitle('')
      setSelectedFile(null)
      event.currentTarget.reset()
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section className="resource-panel">
      <div className="resource-panel-copy">
        <p className="section-kicker">RESOURCE SHARING</p>
        <h2>Upload study materials</h2>
        <p>
          Share notes, PDFs, screenshots, and references with your study group dashboard.
        </p>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="resource-title">Resource title</label>
        <input
          id="resource-title"
          className="form-input"
          type="text"
          placeholder="Example: React hooks revision notes"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label className="form-label" htmlFor="resource-file">Choose file</label>
        <input
          id="resource-file"
          className="form-input"
          type="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
        />

        <button className="primary-btn" type="submit" disabled={isUploading || !currentUser}>
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>

      {!currentUser ? (
        <p className="upload-feedback error-text">Login is required before uploading files.</p>
      ) : null}

      {feedback ? <p className="upload-feedback success-text">{feedback}</p> : null}
      {error ? <p className="upload-feedback error-text">{error}</p> : null}

      <div className="upload-list-block">
        <div className="upload-list-head">
          <h3>Uploaded resources</h3>
          <span>{uploads.length} item(s)</span>
        </div>

        {isLoading ? <p className="muted-text">Loading uploads...</p> : null}

        {!isLoading && !uploads.length ? (
          <p className="muted-text">No files uploaded yet. Add the first shared resource.</p>
        ) : null}

        {!isLoading && uploads.length ? (
          <div className="upload-list">
            {uploads.map((upload) => (
              <article key={upload._id} className="upload-item">
                <div>
                  <p className="upload-title">{upload.title}</p>
                  <p className="upload-meta">
                    {upload.originalName} · {formatFileSize(upload.size)} · {formatUploadDate(upload.createdAt)}
                    {upload.uploadedBy?.username ? ` · uploaded by @${upload.uploadedBy.username}` : ''}
                  </p>
                </div>
                <a className="secondary-btn upload-link" href={upload.fileUrl} target="_blank" rel="noreferrer">
                  Open File
                </a>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default ResourceUploader