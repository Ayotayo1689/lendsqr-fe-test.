import { AlertTriangle, SearchX } from 'lucide-react';

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="state-view state-view--loading" role="status" aria-live="polite" aria-label={label}>
      <span className="skeleton skeleton--title" />
      <span className="skeleton skeleton--long" />
      <span className="skeleton skeleton--short" />
    </div>
  );
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="table-card table-card--skeleton" role="status" aria-live="polite" aria-label="Loading users">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {['Organization', 'Username', 'Email', 'Phone Number', 'Date Joined', 'Status', ''].map((heading) => (
                <th key={heading || 'actions'}>{heading && <span className="skeleton skeleton--head" />}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, index) => (
              <tr key={index}>
                <td data-label="Organization"><span className="skeleton" /></td>
                <td data-label="Username"><span className="skeleton skeleton--short" /></td>
                <td data-label="Email"><span className="skeleton skeleton--long" /></td>
                <td data-label="Phone Number"><span className="skeleton" /></td>
                <td data-label="Date Joined"><span className="skeleton skeleton--long" /></td>
                <td data-label="Status"><span className="skeleton skeleton--pill" /></td>
                <td className="row-actions"><span className="skeleton skeleton--dot" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UserDetailsSkeleton() {
  return (
    <section className="page user-details" role="status" aria-live="polite" aria-label="Loading user details">
      <span className="skeleton skeleton--back-link" />
      <div className="details-heading">
        <span className="skeleton skeleton--title" />
        <div>
          <span className="skeleton skeleton--button" />
          <span className="skeleton skeleton--button" />
        </div>
      </div>
      <article className="profile-card">
        <div className="profile-card__summary">
          <span className="skeleton skeleton--avatar" />
          <div>
            <span className="skeleton skeleton--name" />
            <span className="skeleton skeleton--meta" />
          </div>
          <div className="profile-card__tier">
            <span className="skeleton skeleton--meta" />
            <span className="skeleton skeleton--stars" />
          </div>
          <div>
            <span className="skeleton skeleton--name" />
            <span className="skeleton skeleton--meta" />
          </div>
        </div>
        <div className="details-tabs details-tabs--skeleton">
          {Array.from({ length: 6 }, (_, index) => (
            <span className="skeleton" key={index} />
          ))}
        </div>
      </article>
      <article className="details-card">
        {Array.from({ length: 4 }, (_, sectionIndex) => (
          <section key={sectionIndex}>
            <span className="skeleton skeleton--section-title" />
            <div className="details-grid">
              {Array.from({ length: sectionIndex === 3 ? 4 : 8 }, (_, index) => (
                <div className="detail-item" key={index}>
                  <span className="skeleton skeleton--label" />
                  <span className="skeleton skeleton--value" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </article>
    </section>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="state-view state-view--empty">
      <SearchX size={28} />
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state-view state-view--error" role="alert">
      <AlertTriangle size={28} />
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <button type="button" className="button button--primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
