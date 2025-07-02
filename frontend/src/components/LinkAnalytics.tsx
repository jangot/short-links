import React from 'react';
import { LinkAnalytics } from '../api/linksApi';

interface LinkAnalyticsProps {
  analytics: LinkAnalytics;
}

export const LinkAnalyticsComponent: React.FC<LinkAnalyticsProps> = ({
  analytics,
}) => {
  return (
    <div className="border rounded p-3 mb-3">
      <h6>Статистика</h6>
      <div className="row">
        <div className="col-md-6">
          <strong>Переходов:</strong>
          <span className="badge bg-primary ms-1">{analytics.clicks}</span>
        </div>
        <div className="col-md-6">
          <strong>Статус:</strong>
          <span
            className={`badge ms-1 ${analytics.isExpired ? 'bg-danger' : 'bg-success'}`}
          >
            {analytics.isExpired ? 'Истекла' : 'Активна'}
          </span>
        </div>
      </div>
      {analytics.recentIps.length > 0 && (
        <div className="mt-2">
          <strong>Последние IP:</strong>
          <div className="mt-1">
            {analytics.recentIps.map((ip, index) => (
              <span key={index} className="badge bg-secondary me-1">
                {ip}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
