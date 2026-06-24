'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './BriefsAdmin.css'

export default function BriefsAdminClient() {
  const [briefs, setBriefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, new, processed
  const [selectedBrief, setSelectedBrief] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchBriefs()
  }, [])

  const fetchBriefs = async () => {
    try {
      const response = await fetch('/api/briefs')
      const data = await response.json()
      setBriefs(data.briefs || [])
    } catch (error) {
      console.error('Error fetching briefs:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (briefId, newStatus) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/briefs/${briefId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setBriefs(briefs.map(b =>
          b.id === briefId ? { ...b, status: newStatus } : b
        ))
        if (selectedBrief?.id === briefId) {
          setSelectedBrief({ ...selectedBrief, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const deleteBrief = async (briefId) => {
    if (!confirm('Удалить этот бриф? Это действие нельзя отменить.')) {
      return
    }

    setUpdating(true)
    try {
      const response = await fetch(`/api/briefs/${briefId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setBriefs(briefs.filter(b => b.id !== briefId))
        if (selectedBrief?.id === briefId) {
          setSelectedBrief(null)
        }
      }
    } catch (error) {
      console.error('Error deleting brief:', error)
    } finally {
      setUpdating(false)
    }
  }

  const filteredBriefs = briefs.filter(brief => {
    if (filter === 'all') return true
    return brief.status === filter
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="briefs-admin">
        <div className="briefs-loading">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="briefs-admin">
      <header className="briefs-header">
        <div className="briefs-header-left">
          <Link href="/admin" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Админ
          </Link>
          <h1>Брифы клиентов</h1>
        </div>
        <div className="briefs-count">
          Всего: {briefs.length} | Новых: {briefs.filter(b => b.status === 'new').length}
        </div>
      </header>

      <div className="briefs-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все ({briefs.length})
        </button>
        <button
          className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
          onClick={() => setFilter('new')}
        >
          Новые ({briefs.filter(b => b.status === 'new').length})
        </button>
        <button
          className={`filter-btn ${filter === 'processed' ? 'active' : ''}`}
          onClick={() => setFilter('processed')}
        >
          Обработанные ({briefs.filter(b => b.status === 'processed').length})
        </button>
      </div>

      <div className="briefs-layout">
        <div className="briefs-list">
          {filteredBriefs.length === 0 ? (
            <div className="no-briefs">Брифов пока нет</div>
          ) : (
            filteredBriefs.map(brief => (
              <div
                key={brief.id}
                className={`brief-card ${selectedBrief?.id === brief.id ? 'selected' : ''} ${brief.status}`}
                onClick={() => setSelectedBrief(brief)}
              >
                <div className="brief-card-header">
                  <span className={`status-badge ${brief.status}`}>
                    {brief.status === 'new' ? 'Новый' : 'Обработан'}
                  </span>
                  <span className="brief-date">{formatDate(brief.submittedAt)}</span>
                </div>
                <h3 className="brief-card-name">{brief.name}</h3>
                <p className="brief-card-project">{brief.projectType} • {brief.city}</p>
                <p className="brief-card-email">{brief.email}</p>
              </div>
            ))
          )}
        </div>

        <div className="brief-detail">
          {selectedBrief ? (
            <>
              <div className="detail-header">
                <h2>{selectedBrief.name}</h2>
                <div className="detail-actions">
                  {selectedBrief.status === 'new' ? (
                    <button
                      className="action-btn processed"
                      onClick={() => updateStatus(selectedBrief.id, 'processed')}
                      disabled={updating}
                    >
                      Отметить как обработанный
                    </button>
                  ) : (
                    <button
                      className="action-btn new"
                      onClick={() => updateStatus(selectedBrief.id, 'new')}
                      disabled={updating}
                    >
                      Вернуть в новые
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => deleteBrief(selectedBrief.id)}
                    disabled={updating}
                  >
                    Удалить
                  </button>
                </div>
              </div>

              <div className="detail-section">
                <h4>Контакты</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Email</label>
                    <a href={`mailto:${selectedBrief.email}`}>{selectedBrief.email}</a>
                  </div>
                  <div className="detail-item">
                    <label>Телефон</label>
                    <a href={`tel:${selectedBrief.phone}`}>{selectedBrief.phone}</a>
                  </div>
                  {selectedBrief.company && (
                    <div className="detail-item">
                      <label>Компания</label>
                      <span>{selectedBrief.company}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Проект</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Тип</label>
                    <span>{selectedBrief.projectType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Город</label>
                    <span>{selectedBrief.city}</span>
                  </div>
                  {selectedBrief.projectName && (
                    <div className="detail-item">
                      <label>Название</label>
                      <span>{selectedBrief.projectName}</span>
                    </div>
                  )}
                  {selectedBrief.address && (
                    <div className="detail-item">
                      <label>Адрес</label>
                      <span>{selectedBrief.address}</span>
                    </div>
                  )}
                  {selectedBrief.area && (
                    <div className="detail-item">
                      <label>Площадь</label>
                      <span>{selectedBrief.area} м²</span>
                    </div>
                  )}
                </div>
              </div>

              {(selectedBrief.concept || selectedBrief.targetAudience || selectedBrief.competitors || selectedBrief.references) && (
                <div className="detail-section">
                  <h4>Концепция</h4>
                  {selectedBrief.concept && (
                    <div className="detail-text">
                      <label>Описание концепции</label>
                      <p>{selectedBrief.concept}</p>
                    </div>
                  )}
                  {selectedBrief.targetAudience && (
                    <div className="detail-text">
                      <label>Целевая аудитория</label>
                      <p>{selectedBrief.targetAudience}</p>
                    </div>
                  )}
                  {selectedBrief.competitors && (
                    <div className="detail-text">
                      <label>Конкуренты / Вдохновение</label>
                      <p>{selectedBrief.competitors}</p>
                    </div>
                  )}
                  {selectedBrief.references && (
                    <div className="detail-text">
                      <label>Визуальные референсы</label>
                      <p>{selectedBrief.references}</p>
                    </div>
                  )}
                </div>
              )}

              {(selectedBrief.budget || selectedBrief.timeline || selectedBrief.startDate) && (
                <div className="detail-section">
                  <h4>Бюджет и сроки</h4>
                  <div className="detail-grid">
                    {selectedBrief.budget && (
                      <div className="detail-item">
                        <label>Бюджет</label>
                        <span>{selectedBrief.budget}</span>
                      </div>
                    )}
                    {selectedBrief.timeline && (
                      <div className="detail-item">
                        <label>Сроки</label>
                        <span>{selectedBrief.timeline}</span>
                      </div>
                    )}
                    {selectedBrief.startDate && (
                      <div className="detail-item">
                        <label>Дата начала</label>
                        <span>{selectedBrief.startDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedBrief.additionalInfo && (
                <div className="detail-section">
                  <h4>Дополнительно</h4>
                  <p>{selectedBrief.additionalInfo}</p>
                </div>
              )}

              <div className="detail-meta">
                <span>ID: {selectedBrief.id}</span>
                <span>Язык формы: {selectedBrief.language?.toUpperCase()}</span>
                <span>Отправлено: {formatDate(selectedBrief.submittedAt)}</span>
              </div>
            </>
          ) : (
            <div className="no-selection">
              Выберите бриф из списка
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
