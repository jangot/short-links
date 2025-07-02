import React from 'react';
import { LinkInfo } from '../api/linksApi';
import { getAppUrl } from '../config/appConfig';

interface CreatedLinkCardProps {
  link: LinkInfo;
}

export const CreatedLinkCard: React.FC<CreatedLinkCardProps> = ({ link }) => {
  const shortUrl = getAppUrl() + '/' + (link.alias || link.id);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Ссылка создана</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <strong>Оригинальная:</strong>
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-2"
          >
            {link.originalUrl}
          </a>
        </div>
        <div className="mb-3">
          <strong>Короткая:</strong>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-2"
          >
            {shortUrl}
          </a>
          <button
            className="btn btn-sm btn-success ms-2"
            onClick={() => navigator.clipboard.writeText(shortUrl)}
          >
            Копировать
          </button>
        </div>
        <div className="text-muted small">
          <span className="me-3">
            Создано: {new Date(link.createdAt).toLocaleString('ru-RU')}
          </span>
          <span>
            Срок действия:{' '}
            {link.expiresAt
              ? new Date(link.expiresAt).toLocaleString('ru-RU')
              : 'Без срока действия'}
          </span>
        </div>
      </div>
    </div>
  );
};
